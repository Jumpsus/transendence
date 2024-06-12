# Generated by Django 4.2.13 on 2024-06-09 16:02

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_alter_bracketpair_tournament'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bracketpair',
            name='player1_score',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='bracketpair',
            name='player2_score',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='bracketpair',
            name='tournament',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='matches', to='api.tournament'),
        ),
    ]