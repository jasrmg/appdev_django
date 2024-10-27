import random
from django.shortcuts import get_object_or_404, redirect, render
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import login, logout, get_user_model
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Q
from django.contrib.auth.forms import AuthenticationForm
#for scrolling
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.http import JsonResponse

#for comment submission no refresh
from django.views.decorators.http import require_POST

from OnlyPans.models import Category, Follow, Like, Post, PostImage, Comment

from .forms import EditBioForm, EditPostForm, EditProfileForm, CreatePostForm, SignupForm, LoginForm

# Create your views here.
def test(request):
  return HttpResponse('Hello World!')

def home(request):
  context = {
    'title': 'OnlyPans | Home',
    'sample_text': 'Hello World | OnlyPans Home',
  }
  return render(request, 'OnlyPans/home_test.html', context)

#for capitalizing the first letter of the name:
# def to_title_case(name):
#   return ' '.join(word.capitalize() for word in name.split())  

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
    
    comments = Comment.objects.all()

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
        print("visible posts ids: ", visible_posts_ids)
        print("page obj: ", page_obj)
        if not page_obj:  # If there are no posts to show
            return HttpResponse('')  # Return an empty response for AJAX
        return render(request, 'OnlyPans/post.html', {'posts': page_obj, 'liked_posts': liked_posts})

    # Followers and following
    followers = user.followers.all()
    random_followers = random.sample(list(followers), min(len(followers), 6))
    print(random_followers)
    following = user.following.all()

    number_of_follower = followers.count()
    number_of_following = following.count()

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
        'random_follower': random_followers,
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

        # Prepare response data
        response_data = {
            'user_avatar': request.user.avatar.url,  # User avatar URL
            'user_name': f"{request.user.first_name} {request.user.last_name}",
            'created_at': timesince(comment.created_at),
            'message': comment.message,
            'comment_id': comment.comment_id
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
    comment = get_object_or_404(Comment, comment_id=comment_id)
    if request.method == 'POST' and comment.user == request.user:
        comment.delete()
        return JsonResponse({'status': 'success', 'response': 'YAWA KA BAI'})
    return JsonResponse({'status': 'error'}, status=403)

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
  return render(request, 'OnlyPans/search.html', context)
    
#follow unfollow
@login_required
def follow_user(request, username):
  target_user = get_object_or_404(User, username=username)

  #check if the logged user is already following the target user
  follow, created = Follow.objects.get_or_create(follower=request.user, followed=target_user)

  if not created:
    follow.delete()
  
  return redirect('profile', username=target_user.username)



