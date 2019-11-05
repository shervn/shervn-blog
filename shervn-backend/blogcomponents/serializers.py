from rest_framework import serializers
from .models import *

class TextPostSerializer(serializers.ModelSerializer):

    class Meta:
        model = TextPost 
        fields = ('pk','title', 'description', 'date', 'body', 'className', 'createdAt', 'image')

class SoundCloudPostSerializer(serializers.ModelSerializer):

    class Meta:
        model = SoundCloudPost 
        fields = ('pk','title', 'description', 'date', 'body', 'className', 'createdAt','soundCloudLink', 'playlist')

class AcademicPostSerializer(serializers.ModelSerializer):

    class Meta:
        model = AcademicPost 
        fields = ('pk','title', 'description', 'date', 'organization','createdAt', 'className', 'projectLink')

class ReviewPostSerializer(serializers.ModelSerializer):

    class Meta:
        model = ReviewPost 
        fields = ('pk','title', 'titleLong', 'date', 'body','createdAt', 'className', 'imageUrl', 'bandName')