# Generated by Django 3.1.2 on 2020-11-25 12:44

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('artwork', '0003_auto_20201124_2258'),
        ('core', '0002_auto_20201125_1243'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usermodel',
            name='blocked_users',
            field=models.ManyToManyField(blank=True, related_name='blacklist', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='usermodel',
            name='last_used_tags',
            field=models.ManyToManyField(blank=True, related_name='used_by_users', to='artwork.TagModel'),
        ),
        migrations.AlterField(
            model_name='usermodel',
            name='subscriptions',
            field=models.ManyToManyField(blank=True, related_name='subs', to=settings.AUTH_USER_MODEL),
        ),
    ]
