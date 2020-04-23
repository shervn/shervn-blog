"""blog URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from blogcomponents import views
from django.conf.urls import url
from django.conf import settings

from django.conf.urls.static import static

urlpatterns = [

    url(r'^api/txt_posts/$', views.text_posts_list),
    url(r'^api/sc_posts/$', views.music_posts_list),
    url(r'^api/ac_posts/$', views.academic_posts_list),
    url(r'^api/rv_posts/$', views.review_posts_list),

    path('admin/', admin.site.urls)
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)