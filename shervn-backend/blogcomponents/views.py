from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .models import *
from .serializers import *

@api_view(['POST', 'GET'])
def text_posts_list(request):

    text_posts = TextPost.objects.all().order_by('-order')
    return get_all_objects(request, TextPostSerializer, text_posts, "txt_posts")

@api_view(['POST', 'GET'])
def music_posts_list(request):

    text_posts = SoundCloudPost.objects.all().order_by('-order')
    return get_all_objects(request, SoundCloudPostSerializer, text_posts, "sc_posts")

@api_view(['POST', 'GET'])
def academic_posts_list(request):

    text_posts = AcademicPost.objects.all().order_by('-order')
    return get_all_objects(request, AcademicPostSerializer, text_posts, "ac_posts")

@api_view(['POST', 'GET'])
def review_posts_list(request):

    text_posts = ReviewPost.objects.all().order_by('-order')
    return get_all_objects(request, ReviewPostSerializer, text_posts, "rv_posts")

def get_all_objects(request, Serializer, all_objects, object_type):
    
    object_in_one_page = 12 if(object_type == 'rv_posts') else 15

    data = []
    nextPage = 1
    previousPage = 1
    page = request.GET.get('page', 1)
    paginator = Paginator(all_objects, object_in_one_page)
    try:
        data = paginator.page(page)
    except PageNotAnInteger:
        data = paginator.page(1)
    except EmptyPage:
        data = paginator.page(paginator.num_pages)

    if data.has_next():
        nextPage = data.next_page_number()
    if data.has_previous():
        previousPage = data.previous_page_number()

    serializer = Serializer(data, context={'request': request} , many=True)

    return Response({'data': serializer.data , 'count': paginator.count, 'numpages' : paginator.num_pages, 'nextlink':  '/{}/?page='.format(object_type) + str(nextPage), 'prevlink': '/{}/?page='.format(object_type) + str(previousPage)})


# @api_view(['GET'])
# def text_posts_detail(request, pk):
#     try:
#         text_post = TextPost.objects.get(pk=pk)
#     except TextPost.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     if request.method == 'GET':
#         serializer = TextPostSerializer(text_post, context={'request': request})
#         return Response(serializer.data)