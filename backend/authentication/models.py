from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
import datetime
from django.utils import timezone
import pyotp
from django.conf import settings

# Create your models here.

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    date_joined = models.DateTimeField(auto_now_add=True)
    is_email_verified = models.BooleanField(default=False)
    
    def __str__(self):
        return self.user.username

class OTPVerification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='otps')
    otp_type = models.CharField(max_length=20, default='email')  # For future: 'email', 'sms', etc.
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    
    def __str__(self):
        return f"{self.user.username} - {self.otp_type} OTP"
    
    def save(self, *args, **kwargs):
        if not self.expires_at:
            # Set expiry time when creating new OTP
            self.expires_at = timezone.now() + datetime.timedelta(minutes=settings.OTP_EXPIRY_MINUTES)
        super().save(*args, **kwargs)
    
    @property
    def is_expired(self):
        return timezone.now() > self.expires_at
    
    @staticmethod
    def generate_otp():
        """Generate a 6-digit OTP using pyotp"""
        totp = pyotp.TOTP(settings.OTP_SECRET, interval=settings.OTP_EXPIRY_MINUTES * 60)
        return totp.now()
    
    @staticmethod
    def verify_otp(otp, user, otp_type='email'):
        """Verify the OTP for a given user"""
        try:
            # Get the latest unused, non-expired OTP
            verification = OTPVerification.objects.filter(
                user=user,
                otp_type=otp_type,
                is_used=False,
                expires_at__gt=timezone.now()
            ).latest('created_at')
            
            # Verify the OTP
            totp = pyotp.TOTP(settings.OTP_SECRET, interval=settings.OTP_EXPIRY_MINUTES * 60)
            is_valid = totp.verify(otp, for_time=verification.created_at.timestamp())
            
            if is_valid:
                verification.is_used = True
                verification.save()
                return True
            return False
        except OTPVerification.DoesNotExist:
            return False

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
