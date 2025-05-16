from django.shortcuts import render
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone

from .serializers import (
    RegisterSerializer, 
    UserSerializer, 
    LoginSerializer, 
    OTPVerificationSerializer,
    ResendOTPSerializer
)
from .models import OTPVerification
from .utils import send_otp_email

# Create your views here.

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Generate and send OTP
            otp_record = send_otp_email(user)
            
            return Response({
                'user_id': user.pk,
                'username': user.username,
                'email': user.email,
                'message': 'Registration successful. Please verify your email with the OTP sent.',
                'requires_verification': True
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTPView(APIView):
    permission_classes = [AllowAny]
    serializer_class = OTPVerificationSerializer
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp = serializer.validated_data['otp']
            
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({'error': 'User with this email does not exist'}, status=status.HTTP_404_NOT_FOUND)
            
            # Verify OTP
            if OTPVerification.verify_otp(otp, user):
                # Mark user as verified
                user.profile.is_email_verified = True
                user.profile.save()
                
                # Generate token for the user
                token, _ = Token.objects.get_or_create(user=user)
                
                return Response({
                    'token': token.key,
                    'user_id': user.pk,
                    'username': user.username,
                    'email': user.email,
                    'message': 'Email verification successful'
                }, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResendOTPView(APIView):
    permission_classes = [AllowAny]
    serializer_class = ResendOTPSerializer
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            
            try:
                user = User.objects.get(email=email)
                
                # Check if user is already verified
                if user.profile.is_email_verified:
                    return Response({'message': 'Email is already verified'}, status=status.HTTP_400_BAD_REQUEST)
                
                # Check for existing OTPs and expire them
                existing_otps = OTPVerification.objects.filter(
                    user=user,
                    is_used=False,
                    expires_at__gt=timezone.now()
                )
                for otp in existing_otps:
                    otp.expires_at = timezone.now()
                    otp.save()
                
                # Send new OTP
                otp_record = send_otp_email(user)
                
                return Response({
                    'message': 'New OTP sent successfully',
                    'email': email
                }, status=status.HTTP_200_OK)
                
            except User.DoesNotExist:
                # Return a generic response to prevent email enumeration
                return Response({'message': 'If a user with this email exists, an OTP has been sent'}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserByUsernameView(APIView):
    """
    View to get a user's email by username for OTP verification process.
    This is used when a user tries to login but needs to verify their email.
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        username = request.query_params.get('username', None)
        
        if not username:
            return Response({'error': 'Username parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(username=username)
            return Response({
                'email': user.email,
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class LoginView(APIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            user = authenticate(request, username=username, password=password)
            
            if user:
                # Check if user's email is verified
                if not user.profile.is_email_verified:
                    # Send a new OTP and return a response indicating verification is needed
                    otp_record = send_otp_email(user)
                    return Response({
                        'requires_verification': True,
                        'email': user.email,
                        'message': 'Email verification required. A new OTP has been sent.'
                    }, status=status.HTTP_403_FORBIDDEN)
                
                # If verified, return token
                token, _ = Token.objects.get_or_create(user=user)
                return Response({
                    'token': token.key,
                    'user_id': user.pk,
                    'username': user.username,
                    'email': user.email,
                }, status=status.HTTP_200_OK)
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Delete token
            request.user.auth_token.delete()
            return Response(
                {'message': 'Successfully logged out'},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
