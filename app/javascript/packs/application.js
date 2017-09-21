/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

//console.log('Hello World from Webpacker')
//// Support component names relative to this directory:
//var componentRequireContext = require.context("components", true)
//var ReactRailsUJS = require("react_ujs")
//ReactRailsUJS.useContext(componentRequireContext)


import ReactOnRails from 'react-on-rails';

import App from "../components/App"
import Countries from "../components/Countries"
import FlyoutTabs from "../components/FlyoutTabs"
import Interview from "../components/Interview"
import InterviewSearch from "../components/InterviewSearch"
import InterviewTabs from "../components/InterviewTabs"
import Segment from "../components/Segment"
import Transcript from "../components/Transcript"
import WrapperPage from "../components/WrapperPage"
import ArchiveSearchForm from "../components/ArchiveSearchForm"
import Facet from "../components/Facet"
import Heading from "../components/Heading"
import InterviewPreview from "../components/InterviewPreview"
import Interviews from "../components/Interviews"
import Locations from "../components/Locations"
import SearchForm from "../components/SearchForm"
import TableOfContents from "../components/TableOfContents"
import VideoPlayer from "../components/VideoPlayer"

ReactOnRails.register({
  App,
  Countries,
  FlyoutTabs,
  Interview,
  InterviewSearch,
  InterviewTabs,
  Segment,
  Transcript,
  WrapperPage,
  ArchiveSearchForm,
  Facet,
  Heading,
  InterviewPreview,
  Interviews,
  Locations,
  SearchForm,
  TableOfContents,
  VideoPlayer
});
