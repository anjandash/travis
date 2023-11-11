from pydub import AudioSegment
import os
from django.conf import settings
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from ..models import Post
from .serializers import PostSerializer
from .utils import transcribe_audio

class PostViewSet(ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        post = serializer.save()

        transcription = ""
        if 'audio' in request.FILES:
            audio_file = request.FILES['audio']
            # Save the file directly in the model
            post.audio = audio_file
            post.save()


            # get absolute path of the audio file
            temp_audio_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'temp_audio.wav')

            if not audio_file.name.endswith('.wav'):
                sound = AudioSegment.from_file(post.audio.path)
                sound.export(temp_audio_path, format="wav")
            else:
                temp_audio_path = post.audio.path  # use the original file

            ##############
            # Transcribe #
            ##############

            try:
                # Transcribe audio
                transcription = transcribe_audio(temp_audio_path)
                print("Transcription:", transcription)
            except Exception as e:
                print(f"Error during transcription: {e}")
            finally:
                # Clean up if a conversion was performed
                if not audio_file.name.endswith('.wav'):
                    # os.remove(temp_audio_path)
                    pass

        response_data = {
            'data': serializer.data,
            'message': 'Audio processed successfully',
            'transcription': transcription
        }

        headers = self.get_success_headers(serializer.data)
        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)
