
from django.conf import settings
from django.db import migrations


def link_existing_persons(apps, schema_editor):
    Person = apps.get_model("api", "Person")
    User = apps.get_model(
        settings.AUTH_USER_MODEL
    )

    database = schema_editor.connection.alias

    persons = Person.objects.using(database).filter(
        user__isnull=True
    )

    for person in persons:
        matching_users = list(
            User.objects.using(database).filter(
                email__iexact=person.email
            )[:2]
        )

        if len(matching_users) != 1:
            raise RuntimeError(
                "Impossible de relier la fiche Person "
                f"{person.pk} : nombre de comptes "
                f"correspondants = {len(matching_users)}."
            )

        user = matching_users[0]

        if Person.objects.using(database).filter(
            user_id=user.pk
        ).exclude(pk=person.pk).exists():
            raise RuntimeError(
                f"Le compte User {user.pk} est déjà "
                "associé à une autre fiche Person."
            )

        person.user_id = user.pk
        person.save(
            using=database,
            update_fields=["user"],
        )


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0005_person_user"),
        migrations.swappable_dependency(
            settings.AUTH_USER_MODEL
        ),
    ]

    operations = [
        migrations.RunPython(
            link_existing_persons,
            migrations.RunPython.noop,
        ),
    ]
