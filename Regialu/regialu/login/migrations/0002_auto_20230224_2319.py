# Generated by Django 3.2.18 on 2023-02-25 04:19

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('licencia', '0002_licencias_is_usado'),
        ('login', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='usuario',
            name='license',
        ),
        migrations.AddField(
            model_name='usuario',
            name='plan',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='licencia.planes'),
        ),
    ]