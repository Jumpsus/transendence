from django.urls import path
from user_app import views, friend_management, image_management

urlpatterns = [
    path('status', views.status, name='status'),
    path('login', views.login, name='login'),
    path('register', views.register, name='register'),
    path('loginlist', views.loginlist, name='login_list'), #TODO: delete after test
    path('getinfo', views.get_info, name='get_info'),
    path('updateinfo', views.update_info, name='update_info'),
    path('changepassword', views.change_password, name='change_password'),
    path('getotherinfo', views.get_other_info, name='get_other_info'),
    path('userlist', views.user_list, name='user_list'),
    path('makerelation', friend_management.make_relation, name='make_relation'),
    path('uploadimage', image_management.upload_image, name='upload_image'),
    path('logout', views.logout, name='logout'),
]