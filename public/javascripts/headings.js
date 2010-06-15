/* JS class to handle headings table */

var TableOfContents = Class.create({

    initialize: function(options) {

        this.containerId = options.id || 'interview_headings';
        this.mainClass = options.mainClass || 'mainheading';
        this.subClass = options.subClass || 'subheading';
        this.subListElem = options.subListElem || 'ul';
        this.scrollPosition = options.scrollPosition || 1;
        this.currentClassName = options.currentClassName || 'current';

        this.currentHeading = null;
        this.section = 0;
        this.subsection = 0;

        this.mainHeadings = $$('#' + this.containerId + ' .' + this.mainClass);
        if((!this.mainHeadings) || (this.mainHeadings.length == 0)) {
            throw("No Headings found for container " + this.containerId);
        }

    },

    scrollOffsetPosition: function() {
        return $(this.containerId).scrollTop + ($(this.containerId).getHeight() * this.scrollPosition) + 60;
    },

    toggleSection: function(section) {
        this.toggleSectionNumber(this.parseSectionNumber(section)[0], false, false);
    },

    toggleSectionNumber: function(sectionNum, closeAll, openOnly) {
        var toggledSection = this.getHeading([sectionNum, 0]);
        if((closeAll) && (sectionNum != 0)) {
            for(var i=0; i < this.mainHeadings.length; i++) {
                if((i - sectionNum > 2) || (i - sectionNum < -2)) {
                    var heading = this.mainHeadings[i];
                    if(heading.hasClassName('open')) {
                        heading.removeClassName('open');
                        heading.addClassName('closed');
                    }
                }
            }
        }
        if(toggledSection) {
            if(toggledSection.hasClassName('open') && !openOnly) {
                toggledSection.addClassName('closed');
                toggledSection.removeClassName('open');
            } else {
                // check for className - headings without subheadings
                // don't need to get toggled!
                if(toggledSection.hasClassName('closed')) {
                    toggledSection.removeClassName('closed');
                    toggledSection.addClassName('open');
                }
            }
        }
    },

    parseSectionNumber: function(sectionNum) {
        var section = 0;
        var subSection = 0;
        if(!sectionNum) {
            return [ 0, 0 ];
        }
        if(sectionNum.isString) {
            if(sectionNum =~ /\d+\.\d+/) {
                subSection = parseInt(sectionNum.sub(/^\d+\./,''));
            }
            section = parseInt(sectionNum.sub(/\.\d+$/,''));
        } else {
            section = Math.floor(sectionNum);
            subSection = parseInt(sectionNum.toString().sub(/^\d+/,'').sub('.','') || '0');
        }
        return [section,subSection];
    },

    // get a Heading from sectionArray
    getHeading: function(sectionArray) {
        var section = sectionArray[0];
        var subSection = sectionArray[1];
        var heading = null;
        if(section < 1) return null;
        if(subSection < 1) {
            heading = this.mainHeadings[section-1];
        } else {
            heading = this.mainHeadings[section-1].getElementsBySelector('.' + this.subClass)[subSection-1];
        }
        return heading;
    },

    markHeading: function(sectionInput) {
        var sectionArray = this.parseSectionNumber(sectionInput);
        var section = sectionArray[0];
        var subSection = sectionArray[1];
        
        // only do something when we have a new section or subsection
        if((section != this.section) || (subSection != this.subSection)) {

            // toggleSection on mainheading change
            if(section != this.section) {
                this.toggleSectionNumber(section, true, true);
                this.section = section;
            }

            var newHeading = this.getHeading(sectionArray);
            if(newHeading != this.currentHeading) {
                if(this.currentHeading != null) {
                    this.currentHeading.removeClassName(this.currentClassName);
                }
                if(newHeading) {
                    newHeading.addClassName(this.currentClassName);
                }
            }
            if(newHeading) {
                // smoothly scroll to the new heading
                var newOffset = newHeading.offsetTop - this.scrollOffsetPosition();
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
                this.subSection = subSection;
            }
        }
    }

});