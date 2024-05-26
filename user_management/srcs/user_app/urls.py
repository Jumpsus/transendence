from django.urls import path
from user_app.views import user_management, friend_management, image_management

urlpatterns = [
    path('status', user_management.status, name='status'),
    path('login', user_management.login, name='login'),
    path('register', user_management.register, name='register'),
    path('loginlist', user_management.loginlist, name='login_list'), #TODO: delete after test
    path('getinfo', user_management.get_info, name='get_info'),
    path('updateinfo', user_management.update_info, name='update_info'),
    path('changepassword', user_management.change_password, name='change_password'),
    path('getotherinfo', user_management.get_other_info, name='get_other_info'),
    path('userlist', user_management.user_list, name='user_list'),
    path('makerelation', friend_management.make_relation, name='make_relation'),
    path('uploadimage', image_management.upload_image, name='upload_image'),
    path('logout', user_management.logout, name='logout'),
]