from django.core.management.base import BaseCommand
from licencia.models import licencias
import uuid
from datetime import datetime,timedelta
class Command(BaseCommand):
    help = "Generar Licencia de Activación"

    def add_arguments(self, parser):
        parser.add_argument('count', type=int)
    def handle(self, *args, **options):
        count=options['count']
        for i in range(count):
            key=str(uuid.uuid4())
            expiration_date=datetime.now()+timedelta(days=30)
            license=licencias(key=key,expired_date=expiration_date)
            license.save()
            self.stdout.write(self.style.SUCCESS((f'License {license.key} generated.')))

        
       