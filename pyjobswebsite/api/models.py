
from django.db import models
from django.utils import timezone


class Person(models.Model):
    person_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=254, unique=True)
    user = models.OneToOneField(
        "auth.User",
        on_delete=models.CASCADE,
        related_name="person",
        null=True,
        blank=True,
    )

    class Meta:
        db_table = "Person"

    def __str__(self):
        return self.name


class UserProfile(models.Model):
    ROLE_CHOICES = [
        ("candidate", "Candidat"),
        ("employer", "Employeur"),
    ]

    user = models.OneToOneField(
        "auth.User",
        on_delete=models.CASCADE,
        related_name="profile",
    )
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="candidate",
    )

    class Meta:
        db_table = "UserProfile"

    def __str__(self):
        return f"{self.user.email} - {self.role}"


class Company(models.Model):
    company_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=150)
    owner = models.ForeignKey(
        "auth.User",
        on_delete=models.CASCADE,
        related_name="companies",
    )

    class Meta:
        db_table = "Company"

    def __str__(self):
        return self.name


class Ads(models.Model):
    ad_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=150)
    company = models.ForeignKey(
        Company,
        on_delete=models.PROTECT,
        db_column="company_id",
    )
    category = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    contract_type = models.CharField(max_length=50)
    salary_min = models.IntegerField(null=True, blank=True)
    salary_max = models.IntegerField(null=True, blank=True)
    work_mode = models.CharField(max_length=50)
    work_time = models.CharField(max_length=50)
    experience_level = models.CharField(max_length=50)
    description = models.TextField()

    class Meta:
        db_table = "Ads"
        constraints = [
            models.CheckConstraint(
                condition=(
                    (models.Q(salary_min__isnull=True) | models.Q(salary_min__gte=0))
                    & (models.Q(salary_max__isnull=True) | models.Q(salary_max__gte=0))
                    & (
                        models.Q(salary_min__isnull=True)
                        | models.Q(salary_max__isnull=True)
                        | models.Q(salary_max__gte=models.F("salary_min"))
                    )
                ),
                name="CK_Ads_Salary",
            ),
        ]

    def __str__(self):
        return self.title



class Application(models.Model):
    STATUS_CHOICES = [
        ("pending", "En attente"),
        ("accepted", "Retenue"),
        ("rejected", "Refusée"),
    ]

    application_id = models.AutoField(primary_key=True)

    person = models.ForeignKey(
        Person,
        on_delete=models.PROTECT,
        db_column="person_id",
    )

    ad = models.ForeignKey(
        Ads,
        on_delete=models.CASCADE,
        db_column="ad_id",
    )

    message = models.TextField()

    application_date = models.DateField(
        default=timezone.localdate
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending",
    )

    class Meta:
        db_table = "Application"
        constraints = [
            models.UniqueConstraint(
                fields=["person", "ad"],
                name="UQ_Application_Person_Ads",
            ),
        ]

    def __str__(self):
        return f"{self.person} - {self.ad}"


    class Meta:
        db_table = "Application"
        constraints = [
            models.UniqueConstraint(
                fields=["person", "ad"],
                name="UQ_Application_Person_Ads",
            ),
        ]

    def __str__(self):
        return f"{self.person} - {self.ad}"
