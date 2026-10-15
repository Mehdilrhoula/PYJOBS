from django.contrib import admin
from .models import Company, Ads, Person, Application, UserProfile

admin.site.register(Company)
admin.site.register(Ads)
admin.site.register(Person)
admin.site.register(Application)
admin.site.register(UserProfile)
