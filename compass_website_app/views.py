from django.shortcuts import render
from django.http import HttpResponseRedirect, JsonResponse
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.views.generic.list import ListView
from django.urls import reverse_lazy
from rest_framework import generics

from .models import ExperimentalValue, Compass, MagneticField
from compass_website_app.serializers import CompassSerializer, MagneticFieldSerializer
from compass_website_app.forms import CompassForm, MagneticFieldForm


def experimental_model(request):
    return render(request, "compass/experimental_model.html")


"""
def experimental_model_parameters(request):
    return render(request, 'athlete/index.html')
"""


class ExperimentalValueView(ListView):
    model = ExperimentalValue
    template_name = "compass/experimental_values.html"


class CreateExperimentalValue(CreateView):
    model = ExperimentalValue
    fields = ["disk_diameter", "magnet_offset", "balance", "stability", "rapidity"]
    template_name = "compass/experimental_value_form.html"
    success_url = reverse_lazy("experimental_values")


class UpdateExperimentalValue(UpdateView):
    model = ExperimentalValue
    fields = ["disk_diameter", "magnet_offset", "balance", "stability", "rapidity"]
    template_name = "compass/experimental_value_form.html"
    success_url = reverse_lazy("experimental_values")


class DeleteExperimentalValue(DeleteView):
    model = ExperimentalValue
    template_name = "compass/experimental_value_delete.html"
    success_url = reverse_lazy("experimental_values")


def theoretical_model(request):
    compass_form = CompassForm()
    mag_field_form = MagneticFieldForm()
    context = {
        "compass_form": compass_form,
        "mag_field_form": mag_field_form,
    }
    return render(request, "compass/theoretical_model.html", context)


class CompassList(generics.ListCreateAPIView):
    queryset = Compass.objects.all()
    serializer_class = CompassSerializer


class CompassDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Compass.objects.all()
    serializer_class = CompassSerializer


class MagneticFieldList(generics.ListCreateAPIView):
    queryset = MagneticField.objects.all()
    serializer_class = MagneticFieldSerializer


class MagneticFieldDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = MagneticField.objects.all()
    serializer_class = MagneticFieldSerializer


def theoretical_model_output(request):
    """
    docstring
    """
    return JsonResponse({"foo": "bar"})


# Utility functions
def exp_linear_fit(exp_values):
    """
    Made to take as parameter ExperimentalValue.objects.order_by('pk')
    """
    stab_input = []
    stab_output = []

    for i in range(0, len(exp_values - 1)):
        stab_input.append(
            [
                exp_values[i].magnet_offset * math.pow(exp_values[i].disk_diameter, 3),
                exp_values[i].magnet_offset * math.pow(exp_values[i].disk_diameter, 2),
                exp_values[i].magnet_offset * exp_values[i].disk_diameter,
                exp_values[i].magnet_offset,
            ]
        )
        stab_output.append(exp_values[i].stability)

    stab_fit = np.polyfit(stab_input, stab_output, 3)
    return stab_fit
