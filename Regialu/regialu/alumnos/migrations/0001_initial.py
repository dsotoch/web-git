# Generated by Django 4.1.4 on 2023-02-02 23:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('aula', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='alumnos',
            fields=[
                ('idAlumno', models.BigAutoField(primary_key=True, serialize=False)),
                ('apellidos', models.CharField(max_length=100)),
                ('nombres', models.CharField(max_length=100)),
                ('grado', models.CharField(max_length=100)),
                ('aula', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='aula.aula')),
            ],
        ),
    ]
