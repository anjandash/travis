# Generated by Django 4.2.7 on 2023-11-11 05:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='audio',
            field=models.FileField(blank=True, null=True, upload_to='audios/'),
        ),
    ]
