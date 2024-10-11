from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import User, Post, PostImage, Category 
from django.contrib.auth import get_user_model
from django.forms.widgets import ClearableFileInput
from django.utils.html import format_html

class SignupForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'gender', 'password1', 'password2']  # No 'bio' or 'avatar'

    def save(self, commit=True):
        user = super().save(commit=False)
        if commit:
            user.save()
        return user

class LoginForm(AuthenticationForm):
    username = forms.CharField(label='Username', max_length=100)
    password = forms.CharField(label='Password', widget=forms.PasswordInput)

# Custom ClearableFileInput widget without "Currently" or "Clear"
class CustomClearableFileInput(ClearableFileInput):
    template_name = 'OnlyPans/widgets/custom_clearable_file_input.html'  # Reference to the custom template

    def format_value(self, value):
        """Ensure that the 'Currently' text does not appear."""
        return None  # Prevents showing any current file information
#EDIT PROFILE FORM
class EditProfileForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'avatar']
    
    def __init__(self, *args, **kwargs):
        super(EditProfileForm, self).__init__(*args, **kwargs)
        
        # First name and last name fields
        self.fields['first_name'].widget.attrs.update({'class': 'form-control', 'placeholder': 'First Name'})
        self.fields['last_name'].widget.attrs.update({'class': 'form-control', 'placeholder': 'Last Name'})

        
        # Avatar field (use custom widget)
        self.fields['avatar'].widget = CustomClearableFileInput()
        self.fields['avatar'].label = 'Avatar'  # Label change
        self.fields['avatar'].widget.attrs.update({'class': 'form-control-file'})

#CREATE POST FORM
class CreatePostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['title', 'category', 'description', 'ingredients', 'image']

    title = forms.CharField(
        max_length=100, 
        required=True, 
        widget=forms.TextInput(attrs={'placeholder': 'Name of your Recipe'})
    )

    category = forms.ModelChoiceField(
        queryset=Category.objects.all(), 
        required=True
    )

    description = forms.CharField(
        widget=forms.Textarea(attrs={
            'placeholder': 'Describe your recipe. . .',
            'class': 'description-class',  # Add your custom class
            'style': 'height: 100px;',  # Change the height here'
        }), 
        required=True
    )

    ingredients = forms.CharField(
        widget=forms.Textarea(attrs={
            'placeholder': 'List your ingredients (comma-separated)...',
            'class': 'ingredients-class',  # Add your custom class
            'style': 'height: 80px;',  # Change the height here
        }), 
        required=True
    )

    image = forms.ImageField(required=True)
    #CUSTOM VALIDATION THAT THE INGREDIENT MUST BE COMMA-SEPARATED
    def clean_ingredients(self):
        ingredients = self.cleaned_data.get('ingredients')
        #ensure that the input contains commas and is properly separated
        if ',' not in ingredients:
            raise forms.ValidationError('Please enter the ingredients separated by commas.')
        
        #check if there is at least two ingredients separated by commas
        ingredients_list = ingredients.split(',')
        if len(ingredients_list) < 2:
            raise forms.ValidationError('You must provide at least two ingredients, separated by commas')
        return ingredients
