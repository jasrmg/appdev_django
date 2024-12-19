import json
import random
from django.shortcuts import get_object_or_404, redirect, render
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import login, logout, get_user_model, update_session_auth_hash
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Q, Count, Prefetch
from django.contrib.auth.forms import AuthenticationForm
#for scrolling
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.http import JsonResponse

#for comment submission no refresh
from django.views.decorators.http import require_POST
from OnlyPans.models import Category, Follow, Like, Post, PostImage, Comment
from .forms import EditBioForm, EditPostForm, EditProfileForm, CreatePostForm, SignupForm, LoginForm
#change password
from django.contrib.auth.forms import PasswordChangeForm
from urllib.parse import unquote

# Create your views here.
def test(request):
  return HttpResponse('Hello World!')

from django.utils.timezone import now
from datetime import datetime, timedelta

@login_required
def changepassword_view(request, username):
  if request.method == 'POST':
    form = PasswordChangeForm(user=request.user, data=request.POST)
    #check if the user changed their password in the last week
    last_password_change = request.user.last_password_change
    print('LAST PASSWORD CHANGE: ', last_password_change)
    print('NOW: ', now())
    if last_password_change and (now() - last_password_change) < timedelta(weeks=1):
      messages.error(request, 'You can only change your password once a week!')
      return redirect('profile', username=unquote(username))
    if form.is_valid():
      new_password = form.cleaned_data.get('new_password1')
      full_name = f"{request.user.first_name} {request.user.last_name}".strip().lower()
      print('NEW PASSWORD: ', new_password)
      print('FULL NAME: ', full_name)
      if full_name and full_name.replace(' ', '') in new_password.replace(' ', '').lower():
        messages.error(request, 'Password is too similar to full name.')
        return redirect('profile', username=unquote(username))

      user = form.save()
      user.last_password_change = now()
      user.save()

      update_session_auth_hash(request, user)  # Keeps the user logged in after password change
      messages.success(request, 'Password Changed Successfully!')
      return redirect('profile', username=unquote(username))
    else:
      # Capture specific error messages
      for field, errors in form.errors.items():
        for error in errors:
          messages.error(request, f"{error}")
          return redirect('profile', username=unquote(username))
  else:
    form = PasswordChangeForm(user=request.user)
    
  return render(request, 'OnlyPans/profile_view.html', {'form': form})

def signup_view(request):
  if request.method == 'POST':
    
    form = SignupForm(request.POST)
    if form.is_valid():
      user = form.save(commit=False)
      
      if user.gender == 'M':
        male_avatars = [
          'uploads/profile_pics/male.jpeg',
          'uploads/profile_pics/male2.jpg',
          'uploads/profile_pics/male3.jpg',
          'uploads/profile_pics/male4.jpg',
          'uploads/profile_pics/male5.jpg',
        ]
        user.avatar = random.choice(male_avatars)
      elif user.gender == 'F':
        female_avatars =[
          'uploads/profile_pics/female.jpeg',
          'uploads/profile_pics/female2.jpeg',
          'uploads/profile_pics/female2.jpeg',
          'uploads/profile_pics/female2.jpeg',
          'uploads/profile_pics/female2.jpeg',
        ]
        user.avatar = random.choice(female_avatars)
      else:
        user.avatar = 'uploads/profile_pics/other.jpeg'

      user.set_password(form.cleaned_data['password1']) #bag o
      user.save()
      print('check: ', user.id, user.username, user.gender, user.bio, user.avatar) #i check ang mga inputs na g process pag register sa acc
      login(request, user)
      return redirect('profile', username=user.username)
  else:
    form = SignupForm(request.POST)
  error_messages = ''
  if request.method == 'POST':
    #all error messages:
    error_messages = form.errors.as_text() if form.errors else ''

  print('error: ',error_messages)
  context = {
    'form': form,
    'error_messages': error_messages,
    'title': 'OnlyPans | Sign Up',
  }
  return render(request, 'OnlyPans/signup.html', context)

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)  # Use Django's built-in AuthenticationForm
        
        # Extract username and password from the form
        username = request.POST.get('username')
        password = request.POST.get('password')

        # Check if the user exists
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            user = None  # User does not exist

        if form.is_valid():
            # If the form is valid, log in the user
            user = form.get_user()  # This will only run if the form is valid
            login(request, user)
            return redirect('home')
        else:
            # Handle invalid login (e.g., user doesn't exist or password is incorrect)
            if user is None:
              messages.error(request, "Invalid username!")  # User does not exist
              print('messages: ', messages)
            elif password != user.password:
              messages.error(request, "Invalid password!")  # Password is incorrect
              print('elif messages: ', messages)

    else:
        form = AuthenticationForm()  # Initialize the form

    context = {
        'form': form,
        'title': 'OnlyPans | Login'
    }
    return render(request, 'OnlyPans/login.html', context)

def logout_view(request):
  logout(request)
  return redirect('login')

# def settings_view(request):
#   pass
User = get_user_model()

def edit_profile(request, username):
    user = get_object_or_404(User, username=username)
    form = None

    if request.user == user:
      if request.method == 'POST':
        form = EditProfileForm(request.POST, request.FILES, instance=user)
        if form.is_valid():
          user.first_name = form.cleaned_data['first_name']
          user.last_name = form.cleaned_data['last_name'] 
          print(f'LNAME: {user.last_name}')            
          form.save()              
          print(f'Saved First Name: {user.first_name} Last Name: {user.last_name}')
          messages.success(request, 'Updated and ready to serve! Your profile is now the main course!')
          return redirect('profile', username=user.username)
        else:
          form = EditProfileForm(instance=user)
    
    context = {
        'form': form,
    }
    return render(request, 'OnlyPans/modals/edit_profile.html', context)

def edit_bio(request, username):
  user = get_object_or_404(User, username=username)
  if request.method == 'POST':
     form = EditBioForm(request.POST, instance=user)
     if form.is_valid():
        form.save()
        messages.success(request, '🥳 Ta-da! Your bio just got a glow-up! It’s now sizzling with personality! 🌟🍽️')
        return redirect('profile', username=username)
     else:
        messages.error(request, 'Bio update, failed. Please try again and make sure to use 150 letters only.')
        return redirect('profile', username=username)
  else:
     form = EditProfileForm(instance=user) 
  return render(request, 'OnlyPans/modals/edit_bio.html', {'editbio_form': form})

def create_post(request, username):
  user = get_object_or_404(User, username=username)
  form = None
  
  if request.user == user:
    if request.method == 'POST':
      if 'create_post' in request.POST:
        form = CreatePostForm(request.POST, request.FILES)
        print('inside if: ', form)
        if form.is_valid():
          post = form.save(commit=False)
          post.user = request.user
          post.save()

          #ingredients handling
         
            #check if only one image is uploaded
          image = request.FILES.get('image')
          if image:
            PostImage.objects.create(post=post, image=image)
          else:
            messages.error(request, 'You must upload one image.')
            
          messages.success(request, "You've just whipped up a recipe that's bound to get some cheeky likes!")
          origin = request.POST.get('origin')
          return redirect('profile', username=username)
        else:
          messages.error(request, "Oops! Looks like your ingredients need some space. Toss in a few commas and try again!")

          return redirect('profile', username=username)
  context = {
    'form':form,
  }
  print('outside if: ', form)
  return render(request, 'OnlyPans/modals/create_post.html', context)

@login_required
def edit_post(request, post_id):
  post = get_object_or_404(Post, post_id=post_id)
  # if request.user != post.user:
  #    return redirect('home')
  
  if request.method == 'POST':
    editpost_form = EditPostForm(request.POST, instance=post)
    print('FOOOOOOOORM!!!: ', editpost_form)
    if editpost_form.is_valid():
      editpost_form.save()
      messages.success(request, 'Post updated!')
      return redirect('profile', post.user.username)
    else:
      messages.error(request, 'Post update, failed: ')
      print('Errors Post: ', editpost_form.errors)
      return redirect('profile', post.user.username) 
  else:
    editpost_form = EditPostForm(instance=post)
  
  categories = Category.objects.all()
  context = {
    'editpost_form': editpost_form,
    'categories': categories,
  }
  return render(request, 'OnlyPans/modals/editpost_modal.html', context)


@login_required
def delete_post(request, post_id):
  post = get_object_or_404(Post, post_id=post_id)
  if request.user == post.user:  # Check if the logged-in user is the owner of the post
    post.delete()
    messages.success(request, "Your post has been deleted.")

  #get the next parameter from the request if available
  next_url = request.POST.get('next') or request.GET.get('next')
  search_query = request.GET.get('q')

  #default if next_url is not provided:
  if not next_url:
    next_url = 'home'

  #check if the next_url is the profile
  if 'profile' in next_url:
    next_url = f'/profile/{request.user.username}/'

  #if its from the search view
  if search_query:
    next_url = f'/search/q={search_query}'

  return redirect(next_url)

import re
@login_required
def profile_view(request, username):
    user = get_object_or_404(User, username=username)

    # Flags
    is_own_profile = request.user == user  # Check if the user is the authenticated user
    is_following = Follow.objects.filter(follower=request.user, followed=user).exists()  # Check if the visiting user is following the account

    # Forms
    createpost_form = CreatePostForm()
    editprofile_form = EditProfileForm(instance=user)
    editbio_form = EditBioForm(instance=user)

    # Fetch user posts and prefetch related fields
    posts = Post.objects.filter(user=user).order_by('-created_at').prefetch_related(
        'images',
        'comment_set',
    )

    initial_comment_limit = 2

    # Process all posts to add additional attributes
    for post in posts:
        comments = list(post.comment_set.all())
        post.comment_count = post.comment_set.count()
        post.initial_comments = comments[:initial_comment_limit]
        post.remaining_comments = comments[initial_comment_limit:]

        # Parse ingredients list
        post.ingredients_list = [ingredient.strip() for ingredient in re.split(r',\s*(?![^()]*\))', post.ingredients)]

        # Random comments
        post.random_comments = random.sample(comments, min(2, len(comments)))

        # Count number of words in the post content
        post.word_count = post.word_count()

    # Paginate posts
    paginator = Paginator(posts, 1)  # Display one post per page
    page_number = request.GET.get('page', 1)

    try:
        page_obj = paginator.page(page_number)
    except PageNotAnInteger:
        page_obj = paginator.page(1)  # If the page is not an integer, return the first page
    except EmptyPage:
        return HttpResponse('')  # Stop if there are no more posts

    # Fetch liked posts for the current user
    visible_posts_ids = [post.post_id for post in page_obj.object_list]
    liked_posts = Like.objects.filter(user=request.user, post_id__in=visible_posts_ids).values_list('post_id', flat=True)

    # Handle AJAX requests
    if request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest':
        if not page_obj:  # If there are no posts to show
            return HttpResponse('')  # Return an empty response for AJAX
        return render(request, 'OnlyPans/post.html', {
            'posts': page_obj,
            'liked_posts': liked_posts,
            'initial_comment_limit': initial_comment_limit,
        })

    # Followers and following
    followers = user.followers.exclude(follower=request.user)
    random_followers = random.sample(list(followers), min(len(followers), 6))

    following = user.following.exclude(followed=request.user)

    number_of_follower = followers.count()
    number_of_following = following.count()

    # Fetch categories
    categories = Category.objects.all()

    # Context
    context = {
        'title': 'Profile',
        'user': user,
        'createpost_form': createpost_form,
        'editprofile_form': editprofile_form,
        'editbio_form': editbio_form,
        'categories': categories,

        'is_own_profile': is_own_profile,
        'is_following': is_following,
        'posts': page_obj,

        'follower': followers,
        'following': following,
        'number_of_follower': number_of_follower,
        'number_of_following': number_of_following,
        'random_follower': random_followers,
        'liked_posts': liked_posts,

        'initial_comment_limit': initial_comment_limit,
        'comment_counts': {post.post_id: post.comment_count for post in posts},
    }
    return render(request, 'OnlyPans/profile_view.html', context)



#like
@login_required
def like_view(request, post_id):
  print('Request: ', request.POST)
  post = get_object_or_404(Post, post_id=post_id)
  user = request.user

  existing_like = Like.objects.filter(post=post, user=user).first()
  if existing_like:
    existing_like.delete()
    liked = False
  else:
    Like.objects.create(post=post, user=user)
    liked = True

  like_count = post.like_set.count()#number of likes

  return JsonResponse({'liked': liked, 'like_count': like_count})

#comment
from django.utils.timesince import timesince
@login_required
def add_comment(request):
    if request.method == 'POST':
        post_id = request.POST.get('post_id')
        message = request.POST.get('message')

        # Get the post object
        post = get_object_or_404(Post, pk=post_id)

        # Create the comment
        comment = Comment(post=post, user=request.user, message=message)
        comment.save()
        # messages.success(request, 'Comment added!')

        #get all comment of that post:
        comments = Comment.objects.filter(post=post).order_by('-created_at')
        comment_count = comments.count()

        # Prepare response data
        response_data = {
            'user_avatar': request.user.avatar.url,  # User avatar URL
            'user_name': f"{request.user.first_name} {request.user.last_name}",
            'created_at': timesince(comment.created_at),
            'message': comment.message,
            'comment_id': comment.comment_id,
            'comment_count': comment_count,
        }

        return JsonResponse({'success': True, **response_data})
    return JsonResponse({'error': 'Invalid request'}, status=400)

@login_required
def save_comment(request):#wa na giapil ang id kay apil na siya sa post body
  if request.method == 'POST':
    comment_id = request.POST.get('comment_id')
    updated_comment = request.POST.get('updated_comment')
    print('id save: ', comment_id)
    if not comment_id or not updated_comment:
      return JsonResponse({'status': 'error', 'message': 'Comment ID or updated comment not provided!'}, status=400)
        
    try:
      comment = Comment.objects.get(comment_id=comment_id)
      comment.message = updated_comment
      comment.save()
      return JsonResponse({'status': 'success', 'message': 'Comment updated successfully!'})
    except Comment.DoesNotExist:
      return JsonResponse({'status': 'error', 'message': 'Comment ID not found!'}, status=404)
  return JsonResponse({'status': 'error', 'message': 'Comment id not found!'}, status=404)
#delete comment
@login_required
def delete_comment(request, comment_id):
  print('nag delete')
  comment = get_object_or_404(Comment, comment_id=comment_id)
  if request.method == 'POST' and comment.user == request.user:
    post = comment.post
    comment.delete()
    comment_count = Comment.objects.filter(post=post).count()
    print(comment_count)
    return JsonResponse({
      'status': 'success',
      'comment_count': comment_count, 
      'response': 'YAWAAAAA D MAKUHA RESPONSEEEE!!! FUCK JS'
    })
    return JsonResponse({'status': 'error'}, status=403)

from django.db.models import F
from django.core.serializers.json import DjangoJSONEncoder
# LOAD MORE COMMENTS VIEW
@login_required
def load_more_comments(request, post_id):
    try:
        offset = int(request.GET.get('offset', 2))
        limit = int(request.GET.get('limit', 2))  # Ensure the limit is fetched correctly
    except ValueError:
        return JsonResponse({'error': 'Invalid offset or limit value'}, status=400)

    # Ensure the post exists
    post = get_object_or_404(Post, post_id=post_id)

    # Query the comments
    comments_query = Comment.objects.filter(post_id=post_id).order_by('created_at')
    total_comments = comments_query.count()
    comments = comments_query[offset:offset + limit]

    # Serialize the comments
    comments_data = [
        {
            'comment_id': comment.comment_id,
            'post_id': comment.post_id,
            'user_avatar': comment.user.avatar.url,
            'user_name': f"{comment.user.first_name} {comment.user.last_name}",
            'created_at': time_since(comment.created_at),  # Assuming you have a custom time formatter
            'message': comment.message,
        }
        for comment in comments
    ]

    # Determine if there are more comments to load
    has_more = (offset + limit) < total_comments

    # Return the response
    return JsonResponse({
        'comments': comments_data,
        'has_more': has_more,
        'total_comments': total_comments,
        'next_offset': offset + limit,  # Optional: Provide the next offset for convenience
    }, encoder=DjangoJSONEncoder)

from django.utils.timesince import timesince
from django.utils import timezone

def time_since(created_at):
    now = timezone.now()  # Get the current time with timezone awareness
    delta = now - created_at
    # Use Django's timesince to get the time difference as a string
    time_diff = timesince(created_at)
    
    # Check if the time difference is less than 1 minute
    if delta.total_seconds() < 60:
        return "Just now"
    
    # Split the time difference into parts (e.g., "2 weeks", "3 days")
    time_parts = time_diff.split()
    
    # Define the possible time units in order of priority
    time_units = ["month", "week", "day", "hour", "minute"]
    
    # Iterate over the time_parts and check which time unit is present
    for i in range(0, len(time_parts), 2):  # The number is always at index 0, unit at index 1
        number = int(time_parts[i])  # The number part of the time (e.g., 2, 3, 18)
        unit = time_parts[i + 1]  # The time unit (e.g., month, weeks, days, etc.)
        
        # Check if the current unit is one of the time units we're looking for
        for unit_name in time_units:
            if unit_name in unit:
                # Return the first (highest) unit found
                return f"{number} {unit_name}" + ("s" if number > 1 else "") + " ago"
    
    # Fallback if no unit is found
    return time_diff



#search
def search_suggestions(request):
  query = request.GET.get('q', '').strip()
  if query:
    query_parts = query.split()
    if len(query_parts) > 1:
      suggestions = User.objects.filter(
        Q(first_name__icontains=query_parts[0]) | 
        Q(last_name__icontains=query_parts[1]))[:7]
    else:
      suggestions = User.objects.filter(
        Q(first_name__icontains=query) | Q(last_name__icontains=query))[:7]
    results = [
      {
        'id': user.id, 
        'username': user.username,
        'first_name': user.first_name, 
        'last_name': user.last_name,
        'avatar': user.avatar.url if user.avatar else ''
        } 
        for user in suggestions]
    # print('RESULTS ',results)
  else:
    results = []
  return JsonResponse({'results': results})



def search_view(request, filter_type):
  # Get the search query if it exists
  query = request.GET.get('q', '').strip()

  # Normalize the search query to handle spaces and case sensitivity
  normalized_query = query.strip().lower() if query else ''
  print('NORMALIZED QUERY: ', normalized_query)

  # Filter posts based on filter type and search query
  posts = Post.objects.select_related('user', 'category') \
  .prefetch_related(
    'images',
    'comment_set__user',
    'like_set'
  ) \
  .annotate(
    like_count=Count('like', distinct=True),
    comment_count=Count('comment', distinct=True)
  )
  # print('POSTS CHECK 1: ', posts)
  # CATEGORY
  if filter_type and filter_type not in ['all', 'posts', 'people']:
    posts = posts.filter(category__name=filter_type)
    if query:
      posts = posts.filter(Q(title__icontains=normalized_query) | Q(description__icontains=normalized_query))
    #   print('post inside if: ', posts)
    # print('POSTS CHECK not all: ', posts)
  # print('POSTS CHECK 2: ', posts)

  # POSTS AND ALL + QUERY
  if query and (filter_type == 'posts' or filter_type == 'all'):
    # print('POSTS CHECK 3: ', posts)
    posts = posts.filter(Q(title__icontains=normalized_query) | Q(description__icontains=normalized_query))
    # print('POSTS CHECK 4: ', posts)
  # print('POSTS CHECK 5: ', posts)
  posts = posts.order_by('-created_at')

  # Search users for people filter
  users = []
  if filter_type == 'people' or filter_type == 'all':
    users = User.objects.annotate(
      follower_count=Count('followers', distinct=True)
    ).filter(
      Q(first_name__icontains=normalized_query) | Q(last_name__icontains=normalized_query)
    ).exclude(id=request.user.id)

  # Get all categories to display in the filter
  categories = Category.objects.all()

  context = {
    'query': query,
    'posts': posts,
    'users': users,
    'categories': categories,
    'filter_type': filter_type,  # The filter type (e.g., 'all', 'people', 'posts', etc.)
    }

  return render(request, 'OnlyPans/search.html', context)

def post_popup(request, post_id):
  current_username = request.user.username
  post = get_object_or_404(Post, post_id=post_id)
  comments = post.comment_set.all()
  user_liked = Like.objects.filter(post=post, user=request.user).exists()

  post.ingredients_list = [ingredient.strip() for ingredient in re.split(r',\s*(?![^()]*\))', post.ingredients)] 
  post_images = post.images.all()
  like_count = Like.objects.filter(post=post).count()
  comment_count = Comment.objects.filter(post=post).count()
  post_data = {
    'user_liked': user_liked,
    'logged_username': current_username,
    'first_name': post.user.first_name,
    'last_name': post.user.last_name,
    'created_at': post.created_at,
    'avatar_url': post.user.avatar.url,
    'title': post.title,
    'description': post.description,
    'ingredients': post.ingredients_list,
    'images': [image.image.url for image in post_images],
    'comments': [{'comment_id': comment.comment_id,
                  'first_name': comment.user.first_name,
                  'last_name': comment.user.last_name,
                  'commentor_username': comment.user.username, 
                  'avatar_url': comment.user.avatar.url,
                  'content': comment.message,
                  'created_at': comment.created_at} for comment in comments],
    'like_count': like_count,
    'comment_count': comment_count,
  }

  # context = {
  #   'post': post,
  #   'comments': comments,
  # }
  return JsonResponse(post_data)

#post pop up modal test
def test(request):
  return render(request, 'OnlyPans/post-view.html', )
    
#follow unfollow
@login_required
def follow_user(request, username):
  target_user = get_object_or_404(User, username=username)

  #check if the logged user is already following the target user
  follow, created = Follow.objects.get_or_create(follower=request.user, followed=target_user)
  if not created:
    follow.delete()
    following = False
  else:
    following = True
  #return json response if its an ajax request
  if request.headers.get('x-requested-with') == 'XMLHttpRequest':
    follower_count = Follow.objects.filter(followed=target_user).count()
    following_count = Follow.objects.filter(follower=request.user).count()
    new_follower = {
      'username': request.user.username,
      'avatar_url': request.user.avatar.url,
      'first_name': request.user.first_name,
      'last_name': request.user.last_name,
    } if following else None

    #replacement follower if unfollowing and there are more than 6 followers:
    replacement_follower = None
    if not following and follower_count >= 6:
      extra_follower = Follow.objects.filter(followed=target_user).exclude(follower=request.user).first()
      if extra_follower:
        replacement_follower = {
          'username': extra_follower.follower.username,
          'avatar_url': extra_follower.follower.avatar.url,
          'first_name': extra_follower.follower.first_name,
          'last_name': extra_follower.follower.last_name,
        }

    return JsonResponse({
      'following':following, 
      'follower_count':follower_count, 
      'following_count':following_count,
      'new_follower':new_follower,
      'replacement_follower':replacement_follower,
      })
  
  return redirect('profile', username=target_user.username)


@login_required
def home(request):
  print(request.user.username)
  if request.GET.get('refresh', False):
    request.session['displayed_posts'] = []

  # Retrieve posts that haven't been displayed yet
  displayed_posts_ids = request.session.get('displayed_posts', [])
  new_posts_query = Post.objects.exclude(post_id__in=displayed_posts_ids).order_by('?')

  new_posts = list(new_posts_query[:2])

  displayed_posts_ids.extend([post.post_id for post in new_posts])
  request.session['displayed_posts'] = displayed_posts_ids

  # Add likes and comments data
  posts_data = []
  for post in new_posts:
    likes_count = Like.objects.filter(post=post).count()
    comments_count = Comment.objects.filter(post=post).count()
    images = [image.image.url for image in post.images.all()]
    posts_data.append({
      'post': post,
      'post_id': post.post_id,
      'likes_count': likes_count,
      'comments_count': comments_count,
      'images': images,
    })

  context = {
    'posts_data': posts_data,
    'title': 'Home',
    'user': request.user,
  }
  print('BAI ID: ', posts_data)

  return render(request, 'OnlyPans/home.html', context)


@login_required
def load_more_posts(request):
  # Retrieve posts that haven't been displayed yet
  displayed_posts_ids = request.session.get('displayed_posts', [])
  new_posts_query = Post.objects.exclude(post_id__in=displayed_posts_ids).order_by('?')

  new_posts = list(new_posts_query[:2])

  displayed_posts_ids.extend([post.post_id for post in new_posts])
  request.session['displayed_posts'] = displayed_posts_ids

  # Add likes and comments data
  posts_data = []
  for post in new_posts:
    likes_count = Like.objects.filter(post=post).count()
    comments_count = Comment.objects.filter(post=post).count()
    same_user = request.user.username == post.user.username
    posts_data.append({
      'path': request.path,
      'same_user': same_user,
      'avatar': post.user.avatar.url,
      'logged_user': request.user.username,
      'poster_username': post.user.username,
      'first_name': post.user.first_name,
      'last_name': post.user.last_name,
      'created_at': post.created_at,
      'post_id': post.post_id,
      'category_id': post.category_id,
      'ingredients': post.ingredients,
      'title': post.title,
      'description': post.description,
      'likes_count': likes_count,
      'comments_count': comments_count,
      'image_url': post.images.first().image.url if post.images.first() else None,
    })

  return JsonResponse({'posts_data': posts_data})
