# Generated by Django 5.2.1 on 2025-05-17 07:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_userprofile_is_email_verified_otpverification'),
    ]

    operations = [
        migrations.AddField(
            model_name='otpverification',
            name='otp_code',
            field=models.CharField(max_length=6, null=True),
        ),
    ]
