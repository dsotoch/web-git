# Generated by Django 4.1.4 on 2023-02-02 23:54

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='area',
            fields=[
                ('idArea', models.BigAutoField(primary_key=True, serialize=False)),
                ('descripcion', models.CharField(max_length=158)),
                ('estado', models.CharField(choices=[('ACT', 'Activo'), ('INA', 'Inactivo')], default='ACT', max_length=3)),
            ],
        ),
    ]