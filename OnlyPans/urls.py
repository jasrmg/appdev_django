from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
  path('test/', views.test),
  path('', views.login_view, name='login'), #login
  path('signup/', views.signup_view, name='signup'),#register
  path('logout/', views.logout_view, name='logout'),
  #change password
  path('change-password/<str:username>/', views.changepassword_view, name='change_password'),

  #logged in user:
  path('profile/<str:username>/', views.profile_view, name='profile'),
  
  #delete post:
  path('delete_post/<int:post_id>/', views.delete_post, name='delete_post'),
  #edit post:
  path('edit_post/<int:post_id>/', views.edit_post, name='edit_post'),
  path('edit_profile/<str:username>/', views.edit_profile, name='edit_profile'),
  path('create_post/<str:username>/', views.create_post, name='create_post'),
  
  path('edit_bio/<str:username>/', views.edit_bio, name='edit_bio'),



  #follow unfollow
  path('follow/<str:username>/', views.follow_user, name='follow_user'),
  #like unlike
  path('like/<int:post_id>/', views.like_view, name='like'),

  #comment
  path('add_comment/', views.add_comment, name='add_comment'),
  path('delete_comment/<int:comment_id>/', views.delete_comment, name='delete_comment'),
  #d ra i apil ang pk sa pag save sa comment kay naapil nag pasa sa post request
  path('save_comment/', views.save_comment, name='save_comment'),
  #load more comments:
  path('load_more_comments/<int:post_id>/', views.load_more_comments, name="load_more_comments"),
  path('fetch_next_comment/', views.fetch_next_comment, name="next_comment"),
  
  #search
  path('search/<str:filter_type>/', views.search_view, name='search_view'),
  #search suggestions:
  path('search_suggestions/', views.search_suggestions, name='search_suggestions'),
  #pop up
  path('search/post_view/<int:post_id>/', views.post_popup, name='post_popup'),

  #home
  path('home/', views.home, name='home_default'),
  #create post home
  path('home/create_post/<str:username>/', views.create_post_home, name="create_post_home"),

  path('home/<str:filter_type>', views.home, name='home'),

  #endpoint for loading more posts in home:
  path('home/more/<str:filter_type>/', views.load_more_posts, name='load_more_posts'),

]

