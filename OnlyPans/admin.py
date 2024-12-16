from django.contrib import admin
from .models import Like, User, Post, Category, PostImage, Comment, Follow

# Register your models here.
class UserAdmin(admin.ModelAdmin):
  list_display = ('id', 'username')

class PostAdmin(admin.ModelAdmin):
  list_display = ('post_id', 'get_user_name', 'title', 'display_image')

  def get_user_name(self, obj):
    return obj.user.username
  
  get_user_name.short_description = 'Poster'

  def display_image(self, obj):
    if obj.images.exists():
      return obj.images.first().image.url
  
  display_image.short_description = 'Image'

class CommentAdmin(admin.ModelAdmin):
  list_display = ['comment_id', 'post_id', 'created_at', 'user', 'message']
  
class PostAdmin(admin.ModelAdmin):
  list_display = ['post_id', 'user', 'title', 'category']

admin.site.register(User, UserAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(Category)
# admin.site.register(PostImage)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Follow) 
admin.site.register(Like)