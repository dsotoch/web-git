from django.core.management.base import BaseCommand
from licencia.models import planes


class Command(BaseCommand):
    help = "Generar Planes"

    def add_arguments(self, parser):
        parser.add_argument('descripcion', type=str,
                            help='La descripción del Plan')

        parser.add_argument('precio', type=str, help='El precio del Plan')


    def handle(self, *args, **options):
        descripcion = options['descripcion']
        precio = options['precio']
        plane = planes(nombre_plan=descripcion, precio=precio)
        plane.save()
        return self.stdout.write(self.style.SUCCESS((f'Plan {plane.nombre_plan} generado.')))
