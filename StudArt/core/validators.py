import string

from django.utils.translation import ugettext_lazy as _
from rest_framework.exceptions import ValidationError
from rest_framework.utils.representation import smart_repr


class _Validator:

	def __init__(self, fields):
		self.fields = fields

	def perform_validation(self, attrs):
		raise NotImplementedError()

	def __call__(self, attrs):
		self.perform_validation(attrs)

	def __repr__(self):
		return '<{}(fields={})>'.format(
			self.__class__.__name__,
			smart_repr(self.fields)
		)


class RequiredValidator(_Validator):
	error_message = _('This field is required')

	def perform_validation(self, attrs):
		missing = dict([
			(field_name, self.error_message)
			for field_name in self.fields
			if field_name not in attrs
		])
		if missing:
			raise ValidationError(missing)


class UsernameValidator(_Validator):
	username_key = 'username'
	char_error_message = 'Username must contain only upper and (or) lower case letters, numbers and underscore symbol'
	len_error_message = 'Username must be at least {} and up to {} characters long'
	min_len = 5
	max_len = 30
	allowed_chars = string.ascii_letters + string.digits + '_'

	def __init__(self, username_key=None, min_len=None, max_len=None, allowed_chars=None):
		super(UsernameValidator, self).__init__(None)
		if username_key:
			self.username_key = username_key

		if min_len:
			self.min_len = min_len

		if max_len:
			self.max_len = max_len

		if allowed_chars:
			self.allowed_chars = allowed_chars

	def _validate(self, username):
		if not (self.min_len <= len(username) <= self.max_len):
			return {
				self.username_key: self.len_error_message.format(self.min_len, self.max_len)
			}

		for ch in username:
			if ch not in self.allowed_chars:
				return {self.username_key: self.char_error_message}

		return None

	def perform_validation(self, attrs):
		err = self._validate(attrs.get(self.username_key, ''))
		if err:
			raise ValidationError(err)


class PasswordValidator(_Validator):
	password_key = 'password'
	len_error_message = 'Password must be at least {} characters long'
	min_len = 8

	def __init__(self, password_key=None, min_len=None):
		super(PasswordValidator, self).__init__(None)
		if password_key:
			self.password_key = password_key

		if min_len:
			self.min_len = min_len

	def perform_validation(self, attrs):
		password = attrs.get(self.password_key, '')
		if not (self.min_len <= len(password)):
			raise ValidationError({
				self.password_key: self.len_error_message.format(self.min_len)
			})
