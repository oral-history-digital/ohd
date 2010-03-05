/* JS class to handle headings table */

var TableOfContents = Class.create({

    initialize: function(options) {

        this.containerId = options.id || 'headings';
        this.mainClass = options.mainClass || 'mainheading';
        this.subClass = options.subClass || 'subheading';
        this.subListElem = options.subListElem || 'ul';
        this.scrollPosition = options.scrollPosition || (2/3);
        this.currentClassName = options.currentClassName || 'current';

        this.currentHeading = null;
        this.section = 0;
        this.subsection = 0;

        this.mainHeadings = $$('#' + this.containerId + ' .' + this.mainClass);
        if((!this.mainHeadings) || (this.mainHeadings.length == 0)) {
            throw("No Headings found for container " + this.containerId);
        }

        this.scrollStart = $(this.containerId).down('table').scrollTop + ($(this.containerId).getHeight() * this.scrollPosition);
        
    },

    toggleSection: function(section) {
        var toggledSection = this.getHeading(this.parseSectionNumber(section));
        if(toggledSection) {
            if(toggledSection.hasClassName('open')) {
                toggledSection.addClassName('closed');
                toggledSection.removeClassName('open');
            } else {
                toggledSection.removeClassName('closed');
                toggledSection.addClassName('open');
            }
        }
    },

    parseSectionNumber: function(sectionString) {
        var section = 0;
        var subSection = 0;
        if(sectionString.isString) {
            if(section =~ /\d+\.\d+/) {
                subSection = parseInt(section.substr(/\d+$/));
            }
            section = parseInt(section.substr(/^\d+/));
        } else {
            return [ sectionString, 0 ];
        }
        return [section,subSection];
    },

    // get a Heading from sectionArray
    getHeading: function(sectionArray) {
        var section = sectionArray[0];
        var subSection = sectionArray[1];
        var heading = null;
        if(subSection == 0) {
            heading = this.mainHeadings[section-1];
        } else {
            heading = this.mainHeadings.getElementsBySelector('.' + this.subClass)[subSection-1];
        }
        return heading;
    },

    markHeading: function(sectionInput) {
        alert('MARK HEADING: ' + sectionInput);
        var sectionArray = this.parseSectionNumber(sectionInput);
        var section = sectionArray[0];
        var subSection = sectionArray[1];
        // only do something when we have a new section and subsection
        if((section != this.section) && (subSection != this.subSection)) {
            var newHeading = getHeading(sectionArray);
            if(newHeading != this.currentHeading) {
                this.currentHeading.removeClassName(this.currentClassName);
            }
            if(newHeading) {
                newHeading.addClassName(this.currentClassName);
                
                // smoothly scroll to the new heading
                var newOffset = newHeading.offsetTop - this.scrollStart;
                if(newHeading.hasClassName(this.subClass)) {
                    // add the mainheading's offsetTop
                    var sectionHeading = newHeading.up('.' + this.mainClass);
                    if(sectionHeading) {
                      newOffset = newOffset + sectionHeading.offsetTop;
                    }
                }
                if(newOffset < 0) { newOffset = 0; }
                new Effect.Tween(this.containerId, $(this.containerId).scrollTop, newOffset, { duration: 0.6 }, 'scrollTop');

                // update current status variables
                this.currentHeading = newHeading;
                this.section = section;
                this.subSection = subSection;
            }
        }
    }

});