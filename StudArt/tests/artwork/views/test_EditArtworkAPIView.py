from artwork.views.artwork import EditArtworkAPIView
from tests.common import APIFactoryTestCase


class EditArtworkTestCase(APIFactoryTestCase):
	def setUp(self) -> None:
		super(EditArtworkTestCase, self).setUp()
		self.view = EditArtworkAPIView.as_view()
