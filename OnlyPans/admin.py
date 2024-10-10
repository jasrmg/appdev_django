from django.contrib import admin
from .models import User, Post, Category, Ingredient, PostImage

# Register your models here.
class UserAdmin(admin.ModelAdmin):
  list_display = ('id', 'username')

admin.site.register(User, UserAdmin)
admin.site.register(Post)
admin.site.register(Category)
admin.site.register(Ingredient)
admin.site.register(PostImage)