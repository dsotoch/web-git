# Generated by Django 4.1.4 on 2023-02-09 23:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('incidencia', '0002_remove_incidencia_alumno_incidencia_alumno'),
    ]

    operations = [
        migrations.AlterField(
            model_name='incidencia',
            name='descripcion',
            field=models.CharField(max_length=700),
        ),
    ]
