# Generated by Django 3.2.18 on 2023-02-23 23:54

from decimal import Decimal
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('licencia', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='PagoPaypal',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('payment_id', models.CharField(db_index=True, max_length=64)),
                ('payer_id', models.CharField(blank=True, db_index=True, max_length=128)),
                ('payer_email', models.EmailField(blank=True, max_length=254)),
                ('monto', models.DecimalField(decimal_places=2, default=Decimal('0.00'), max_digits=8)),
                ('pagado', models.BooleanField(default=False)),
                ('plan', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='licencia.planes')),
            ],
        ),
        migrations.CreateModel(
            name='transaccion',
            fields=[
                ('numero', models.AutoField(max_length=100, primary_key=True, serialize=False)),
                ('fecha', models.DateTimeField()),
                ('monto', models.CharField(max_length=20)),
                ('pago', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='pago.pagopaypal')),
            ],
        ),
    ]