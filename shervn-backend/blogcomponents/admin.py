from django.contrib import admin
from .models import TextPost, SoundCloudPost, AcademicPost, ReviewPost, VideoPost

# Register your models here.
admin.site.register(TextPost)
admin.site.register(SoundCloudPost)
admin.site.register(AcademicPost)
admin.site.register(ReviewPost)
admin.site.register(VideoPost)