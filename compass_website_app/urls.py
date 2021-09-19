from django.urls import path

from . import views

urlpatterns = [
    path("experimental-model/", views.experimental_model, name="experimental_model"),
    path(
        "experimental-values/",
        views.ExperimentalValueView.as_view(),
        name="experimental_values",
    ),
    path(
        "experimental-values/create/",
        views.CreateExperimentalValue.as_view(),
        name="create_experimental_value",
    ),
    path(
        "experimental-values/update/<pk>/",
        views.UpdateExperimentalValue.as_view(),
        name="update_experimental_value",
    ),
    path(
        "experimental-values/delete/<pk>/",
        views.DeleteExperimentalValue.as_view(),
        name="delete_experimental_value",
    ),
    path("theoretical-model/", views.theoretical_model, name="theoretical_model"),
    path("api/compass/", views.CompassList.as_view()),
    path("api/compass/<int:pk>/", views.CompassDetail.as_view()),
    path("api/magnetic-field/", views.MagneticFieldList.as_view()),
    path("api/magnetic-field/<int:pk>/", views.MagneticFieldDetail.as_view()),
    path(
        "api/theoretical-model-output/",
        views.theoretical_model_output,
        name="theoretical_model_output",
    ),
]
