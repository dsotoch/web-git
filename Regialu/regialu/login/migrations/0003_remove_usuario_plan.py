# Generated by Django 3.2.18 on 2023-02-25 04:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0002_auto_20230224_2319'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='usuario',
            name='plan',
        ),
    ]
