from django.db import models

# Create your models here.
class Post(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    audio = models.FileField(upload_to='audios/', null=True, blank=True)

    def __str__(self):
        return f"Post: {self.title}"