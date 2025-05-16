from django.core.mail import send_mail
from django.conf import settings
from .models import OTPVerification

def send_otp_email(user):
    """
    Generates an OTP and sends it to the user's email
    """
    # Generate OTP
    otp = OTPVerification.generate_otp()
    
    # Create OTP record
    otp_record = OTPVerification(user=user)
    otp_record.save()
    
    # Prepare email content
    subject = 'Verify Your Email - Your OTP Code'
    message = f"""
Hello {user.first_name},

Thank you for registering with Turnitin. To complete your registration, please use the following verification code:

{otp}

This code will expire in {settings.OTP_EXPIRY_MINUTES} minutes.

If you did not request this code, please ignore this email.

Best regards,
The Turnitin Team
    """
    
    # Send email
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )
    
    return otp_record 