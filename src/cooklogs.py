# -*- coding: utf-8 -*-

import cgi
import os

from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app

class BasePage(webapp.RequestHandler):
	def write_page_template(self, templateName, templateValues):
		path = os.path.join(os.path.dirname(__file__), 'templates')
		path = os.path.join(path, templateName)
		self.response.out.write(template.render(path, templateValues))

	def write_page_header(self):
		self.write_page_template('header.html', {})

	def write_page_footer(self):
		self.write_page_template('footer.html', {})

class MainPage(BasePage):
	def get(self):
		self.write_page_header()

		# アクション名を取得
		actionName = self.request.path
		pos = actionName.rfind('/')
		if pos < 0:
			actionName = ''
		else:
			actionName = actionName[pos + 1:len(actionName)]
		if len(actionName) <= 0:
			actionName = 'index'

		self.write_page_template(actionName + '.html', {})

		self.write_page_footer()

application = webapp.WSGIApplication(
									 [('.*', MainPage)],
									 debug=True)

def main():
	run_wsgi_app(application)

if __name__ == "__main__":
	main()