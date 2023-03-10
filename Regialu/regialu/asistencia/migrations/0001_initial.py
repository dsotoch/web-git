# Generated by Django 4.1.4 on 2023-02-16 02:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('area', '0001_initial'),
        ('aula', '0002_institucion_periodo'),
        ('alumnos', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='asistencia',
            fields=[
                ('idAsistencia', models.BigAutoField(primary_key=True, serialize=False)),
                ('fechaRegistro', models.DateField()),
                ('fechaActualizacion', models.DateField()),
                ('estado', models.CharField(max_length=51)),
                ('alumno', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='alumnos.alumnos')),
                ('area', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='area.area')),
                ('aulas', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='aula.aula')),
            ],
        ),
    ]
