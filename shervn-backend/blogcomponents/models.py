from django.db import models

class TextPost(models.Model):

    order = models.IntegerField(default=0)
    title = models.TextField()
    description = models.TextField(blank=True, null=True)
    date = models.CharField(max_length=50)
    body = models.TextField()
    className = models.CharField(max_length=20, default="farsiPost")
    createdAt = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(blank=True)

    def __str__(self):
        return self.title

class SoundCloudPost(models.Model):

    order = models.IntegerField(default=0)
    title = models.TextField()
    description = models.TextField(blank=True, null=True)
    date = models.CharField(max_length=50)
    body = models.TextField()
    className = models.CharField(max_length=20, default="farsiPost")
    createdAt = models.DateTimeField(auto_now_add=True)
    soundCloudLink = models.URLField()
    playlist = models.BooleanField(default=False)

    def __str__(self):
        return self.title

class AcademicPost(models.Model):

    order = models.IntegerField(default=0)
    title = models.TextField()
    description = models.TextField(blank=True, null=True)
    organization = models.TextField(max_length=120)
    date = models.CharField(max_length=50)
    className = models.CharField(max_length=20, default="post")
    createdAt = models.DateTimeField(auto_now_add=True)
    projectLink = models.URLField(blank=True)

    def __str__(self):
        return self.title

class ReviewPost(models.Model):
    order = models.IntegerField(default=0)
    title = models.TextField()
    titleLong = models.TextField()
    date = models.CharField(max_length=50)
    body = models.TextField()
    className = models.CharField(max_length=20, default="farsiPost")
    createdAt = models.DateTimeField(auto_now_add=True)
    imageUrl = models.ImageField(upload_to="review_images/")
    bandName = models.CharField(max_length=30)

    def __str__(self):
        return self.title