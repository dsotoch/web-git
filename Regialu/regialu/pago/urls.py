from django.urls import path
from pago import views
urlpatterns = [
    path('<plan>/', views.paypal_payment, name="pago-paypal"),
    path('', views.cuenta),
    path('/', views.success),
    path('/Details/', views.estado_pago),
    path('/Details/activateLicence/',views.activar_licencia),


]
