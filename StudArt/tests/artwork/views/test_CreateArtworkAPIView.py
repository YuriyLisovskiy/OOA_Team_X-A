from artwork.views.artwork import CreateArtworkAPIView
from tests.common import APIFactoryTestCase


class CreateArtworkTestCase(APIFactoryTestCase):
	def setUp(self) -> None:
		super(CreateArtworkTestCase, self).setUp()
		self.view = CreateArtworkAPIView.as_view()