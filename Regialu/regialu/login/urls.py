from django.urls import path
from login import views
from licencia import views as w
from login.views import CustomLoginView
urlpatterns = [path('Account/', views.account, name="cuenta"),
               path('Account/success/', views.success, name="success"),
               path('register/', views.index, name="register"),
               path('', CustomLoginView.as_view(), name="customlogin"),
               path('password/', views.password),
               path('log/', views.login_success),
               path('logout/', views.login_logout),
               path('register/saveUser/<int:dni>/', views.save_user),
               path('register/resume/', views.resumen),
               path('Account/verifi/', w.check_license),
               path('Account/password/', views.cambiar_password),

               ]
