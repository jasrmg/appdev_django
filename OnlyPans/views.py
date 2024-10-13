import random
from django.shortcuts import get_object_or_404, redirect, render
from django.http import HttpResponse
from django.contrib.auth import login, logout, get_user_model
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Q
#for scrolling
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.http import JsonResponse


from OnlyPans.models import Follow, Ingredient, Post, PostImage

from .forms import EditBioForm, EditProfileForm, CreatePostForm, SignupForm, LoginForm

# Create your views here.
def test(request):
  return HttpResponse('Hello World!')

def home(request):
  context = {
    'title': 'OnlyPans | Home',
  }
  return render(request, 'OnlyPans/home_test.html', context)

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
      user.save()
      print(user.id, user.username, user.gender, user.bio, user.avatar) #i check ang mga inputs na g process pag register sa acc
      login(request, user)
      return redirect('home')
  else:
    form = SignupForm()
  context = {
    'form': form,
  }
  return render(request, 'OnlyPans/signup.html', context)

def login_view(request):
  if request.method == 'POST':
    form = LoginForm(request, data=request.POST)
    if form.is_valid():
      user = form.get_user()
      print(user.id, user.username)#i check ang na retrieve na user
      login(request, user)
      return redirect('home')
  else:
    form = LoginForm()
  context = {
    'form': form,
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
                form.save()
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
          ingredients_name = form.cleaned_data['ingredients'].split(',')
          for name in ingredients_name:
            ingredient, created = Ingredient.objects.get_or_create(name=name.strip())
            post.ingredients.add(ingredient)

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

#profile view main code
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
    posts = Post.objects.filter(user=user).order_by('-created_at').prefetch_related('images', 'comment_set', 'ingredients')

    # Process each post for random comments and its ingredients
    for post in posts:
        comments = list(post.comment_set.all())
        # Fetch the first 3 ingredients
        post.ingredients_list = post.ingredients.all()[:3]
        # 2 random comments
        post.random_comments = random.sample(comments, min(2, len(comments)))

    paginator = Paginator(posts, 1)  # Display one post per page
    page_number = request.GET.get('page', 1)  # Get the current page number from the request

    try:
        page_obj = paginator.page(page_number)
    except PageNotAnInteger:
        page_obj = paginator.page(1)  # If the page is not an integer, return the first page
    except EmptyPage:
        page_obj = []  # Return an empty list if the page is out of range

    # Handle AJAX requests
    if request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest':
        if not page_obj:  # If there are no posts to show
            return HttpResponse('')  # Return an empty response for AJAX
        return render(request, 'OnlyPans/post.html', {'posts': page_obj})

    # Followers and following
    followers = user.followers.all()
    following = user.following.all()
    number_of_follower = followers.count()
    number_of_following = following.count()

    context = {
        'title': 'OnlyPans | Profile',
        'user': user,
        'createpost_form': createpost_form,
        'editprofile_form': editprofile_form,
        'editbio_form': editbio_form,
        'is_own_profile': is_own_profile,
        'is_following': is_following,
        'posts': page_obj,
        'follower': followers,
        'following': following,
        'number_of_follower': number_of_follower,
        'number_of_following': number_of_following,
    }
    return render(request, 'OnlyPans/profile_view.html', context)


@login_required
def delete_post(request, post_id):
    post = get_object_or_404(Post, post_id=post_id)
    if request.user == post.user:  # Check if the logged-in user is the owner of the post
        post.delete()
        messages.success(request, "Your post has been deleted.")
    return redirect('profile', username=request.user.username)

#search
def search_view(request):
  query = request.GET.get('q')
  post = []
  users = []

  if query:
    #search post by title or description:
    posts = Post.objects.filter(
      Q(title__icontains=query) | Q(description__icontains=query)
    ).distinct()
    #search users by username or name
    users = User.objects.filter(
      Q(username__icontains=query) | Q(first_name__icontains=query) | Q(last_name__icontains=query)
    ).distinct()

  context = {
    'query': query,
    'posts': posts,
    'users': users,
  }
  return render(request, 'OnlyPans/searchtest.html', context)
    
# @login_required
# def edit_post(request, post_id):
#     post = get_object_or_404(Post, post_id=post_id)
#     if request.user == post.user:  # Check if the logged-in user is the owner of the post
#         if request.method == 'POST':
#             form = CreatePostForm(request.POST, request.FILES, instance=post)
#             if form.is_valid():
#                 form.save()
#                 messages.success(request, "Your post has been updated successfully!")
#                 return redirect('profile', username=request.user.username)
#         else:
#             form = CreatePostForm(instance=post)
#         return render(request, 'OnlyPans/edit_post.html', {'form': form})
#     else:
#         messages.error(request, "You do not have permission to edit this post.")
#         return redirect('profile', username=request.user.username)



