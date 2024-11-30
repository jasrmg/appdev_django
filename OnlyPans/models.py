import os
from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):

    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Others'),
    ]
    username = models.CharField(max_length=200, unique=True)

    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, default='O')

    bio = models.CharField(max_length=150, default='Edit your Bio')
    avatar = models.ImageField(null=True, blank=True, default='images/avatars/other.jpeg', upload_to='uploads/profile_pics/')
    #for changepassword cooldown added on 2024/11/30(yyyy/mm/dd)
    last_password_change = models.DateTimeField(null=True, blank=True)

    USERNAME_FIELD = 'username'

    def __str__(self):
        return self.get_full_name()


# Categories Model
class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


# Posts Model
class Post(models.Model):
    post_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    ingredients = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)  # Relationship to Category
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Relationship to User (author of post)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def word_count(self):
        return len(self.description.split())

    def __str__(self):
        return self.title

def recipe_image_upload_path(instance, filename):
    #extract the title and username of the poster:
    post_title = instance.post.title.replace(" ", "_")#replace spaces with underscores
    username = instance.post.user.username
    #create a unique filename
    new_filename = f"{post_title}_{username}_{filename}"
    return os.path.join('uploads', 'recipe_pics', new_filename)

class PostImage(models.Model):
    post = models.ForeignKey(Post, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to=recipe_image_upload_path)

# Comments Model
class Comment(models.Model):
    comment_id = models.AutoField(primary_key=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)  # Relationship to Post
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Relationship to User (who commented)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}: {self.message}"


# Likes Model
class Like(models.Model):
    like_id = models.AutoField(primary_key=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)  # Relationship to Post
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Relationship to User (who liked)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('post', 'user')  # Ensure one user can only like a post once

    def __str__(self):
        return f"{self.user.username} liked {self.post.title}"


# Follows Model
class Follow(models.Model):
    follower = models.ForeignKey(User, related_name='following', on_delete=models.CASCADE)  # The user who follows
    followed = models.ForeignKey(User, related_name='followers', on_delete=models.CASCADE)  # The user being followed
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('follower', 'followed')  # Ensure one user can't follow another multiple times

    def __str__(self):
        return f"{self.follower.username} follows {self.followed.username}"


# Notifications Model
class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('like', 'Like'),
        ('comment', 'Comment'),
        ('follow', 'Follow'),
    ]

    notification_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, related_name='notifications', on_delete=models.CASCADE)  # User receiving notification
    trigger_user = models.ForeignKey(User, related_name='triggered_notifications', on_delete=models.CASCADE)  # Who triggered the notification
    post = models.ForeignKey(Post, null=True, blank=True, on_delete=models.CASCADE)  # Related post (nullable for follows)
    type = models.CharField(max_length=10, choices=NOTIFICATION_TYPES)  # Notification type
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.type == 'follow':
            return f"{self.trigger_user.username} followed {self.user.username}"
        elif self.type == 'like':
            return f"{self.trigger_user.username} liked your post {self.post.title}"
        elif self.type == 'comment':
            return f"{self.trigger_user.username} commented on your post {self.post.title}"
