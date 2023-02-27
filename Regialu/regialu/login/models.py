from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import BaseUserManager
from django.contrib.auth.models import Group



class MiAdministradorDeUsuarios(BaseUserManager):
    def create_user(self, dni, password=None, nombre=None, apellido=None, pais=None, email=None,is_admin=None,groups=None):
        usuario = self.model(dni=dni, nombre=nombre,groups=groups,
                             apellido=apellido, pais=pais, email=email,is_admin=is_admin)
        usuario.set_password(password)
        usuario.save(using=self._db)
        return usuario

    def create_superuser(self, dni, password, nombre, email,is_admin,
                         apellido,
                         pais,groups):
        user = self.create_user(dni, email=email, password=password,groups=groups,
                                nombre=nombre, apellido=apellido, pais=pais ,is_admin=True)
        user.save(using=self._db)
        return user


class usuario(AbstractBaseUser):
    dni = models.CharField(primary_key=True, max_length=10)
    nombre = models.CharField(max_length=150)
    apellido = models.CharField(max_length=150)
    email = models.EmailField(max_length=200, unique=True)
    password = models.CharField(max_length=150)
    pais = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    objects = MiAdministradorDeUsuarios()
    groups=models.ForeignKey(Group,null=True,on_delete=models.SET_NULL)
    USERNAME_FIELD = 'dni'
    REQUIRED_FIELDS = ['nombre', 'apellido', 'email','is_admin',
                       'password',
                       'pais']

    def get_full_name(self):
        return f'{self.nombre} {self.apellido}'

    def get_short_name(self):
        return self.nombre

    def __str__(self):
        return self.dni

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.is_admin
