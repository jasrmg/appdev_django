import random
from django.shortcuts import get_object_or_404, redirect, render
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import login, logout, get_user_model
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Q
#for scrolling
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.http import JsonResponse
from django.db.models import Prefetch


from OnlyPans.models import Category, Follow, Like, Post, PostImage

from .forms import EditBioForm, EditPostForm, EditProfileForm, CreatePostForm, SignupForm, LoginForm

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
  print('Post: ', post)
  if request.user != post.user:
     return redirect('home')
  
  if request.method == 'POST':
    editpost_form = EditPostForm(request.POST, instance=post)
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
  
  return render(request, 'OnlyPans/modals/editpost_modal.html', {'editpost_form':editpost_form})


@login_required
def delete_post(request, post_id):
    post = get_object_or_404(Post, post_id=post_id)
    if request.user == post.user:  # Check if the logged-in user is the owner of the post
        post.delete()
        messages.success(request, "Your post has been deleted.")
    return redirect('profile', username=request.user.username)

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
    
    #check if there is a post to edit:
    post_to_edit = None
    if request.method == 'POST' and 'edit_post_id' in request.POST:
      post_id = request.POST.get('edit_post_id')
      post_to_edit = get_object_or_404(Post, pk=post_id, user=user)
      editpost_form = EditPostForm(instance=post_to_edit)
    else:
      editpost_form = EditPostForm()

    # Fetch user posts and prefetch related fields
    posts = Post.objects.filter(user=user).order_by('-created_at').prefetch_related(
    'images',
    'comment_set',
    # 'like_set'  # Prefetch likes for the current user
)
    
    for post in posts:
        comments = list(post.comment_set.all())
        # Fetch the first 3 ingredients
        post.ingredients_list = [ingredient.strip() for ingredient in post.ingredients.split(',')]
        post.ingredients_list = post.ingredients_list[:3]
        # 2 random comments
        post.random_comments = random.sample(comments, min(2, len(comments)))

    paginator = Paginator(posts, 1)  # Display one post per page
    page_number = request.GET.get('page', 1)

    try:
        page_obj = paginator.page(page_number)
    except PageNotAnInteger:
        page_obj = paginator.page(1)  # If the page is not an integer, return the first page
    except EmptyPage:
        return HttpResponse('') #stop if there is no more post
    
    if page_obj:
      visible_posts_ids = [post.post_id for post in page_obj.object_list]
    else:
      visible_posts_ids = []

    # Fetch the liked posts for the current user and the current page
    visible_posts_ids = [post.post_id for post in page_obj.object_list]

    liked_posts = Like.objects.filter(user=request.user, post_id__in=visible_posts_ids).values_list('post_id', flat=True)

    # Handle AJAX requests
    if request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest':
        if not page_obj:  # If there are no posts to show
            return HttpResponse('')  # Return an empty response for AJAX
        return render(request, 'OnlyPans/post.html', {'posts': page_obj, 'liked_posts': liked_posts})

    # Followers and following
    followers = user.followers.all()
    following = user.following.all()
    number_of_follower = followers.count()
    number_of_following = following.count()
    print('followers:')
    for follow in followers:
      print(follow.follower.username)

    categories = Category.objects.all()
    context = {
        'title': 'OnlyPans | Profile',
        'user': user,
        'createpost_form': createpost_form,
        'editprofile_form': editprofile_form,
        'editbio_form': editbio_form,
        'editpost_form': editpost_form,
        'post_to_edit': post_to_edit,
        'categories': categories,

        'is_own_profile': is_own_profile,
        'is_following': is_following,
        'posts': page_obj,

        'follower': followers,
        'following': following,
        'number_of_follower': number_of_follower,
        'number_of_following': number_of_following,

        'liked_posts': liked_posts,
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

  #kung asa i redirect home ba or profile.
  # next_url = request.GET.get('next')
  # if next_url:
  #   return HttpResponseRedirect(next_url)
  #default:
  # return redirect('profile', username=request.user.username)
  
  return JsonResponse({'liked': liked, 'like_count': like_count})


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
    
#follow unfollow
@login_required
def follow_user(request, username):
  target_user = get_object_or_404(User, username=username)

  #check if the logged user is already following the target user
  follow, created = Follow.objects.get_or_create(follower=request.user, followed=target_user)

  if not created:
    follow.delete()
  
  return redirect('profile', username=target_user.username)



