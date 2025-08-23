// Configure Turbo
import "@hotwired/turbo-rails"

// Configure Stimulus
import { Application } from "@hotwired/stimulus"

const application = Application.start()

// Load all Stimulus controllers
import DropdownController from "./controllers/dropdown_controller"
import ModalController from "./controllers/modal_controller" 
import DataTableController from "./controllers/data_table_controller"
import FeaturedInterviewsController from "./controllers/featured_interviews_controller"
import ArchiveSearchController from "./controllers/archive_search_controller"
import SearchFormController from "./controllers/search_form_controller"

application.register("dropdown", DropdownController)
application.register("modal", ModalController)
application.register("data-table", DataTableController)
application.register("featured-interviews", FeaturedInterviewsController)
application.register("archive-search", ArchiveSearchController)
application.register("search-form", SearchFormController)

// Import existing stylesheets
import("stylesheets/main.scss")