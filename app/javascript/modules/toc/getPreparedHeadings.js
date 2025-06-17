export function getPreparedHeadings(rawHeadings, alpha3){
    let mainIndex = 0;
    let mainheading = '';
    let subIndex = 0;
    let subheading = '';
    let headings = [];
    let lastMainheading = '';

    if (rawHeadings) {
        Object.values(rawHeadings).sort(function(a, b) {return a.tape_nbr - b.tape_nbr || a.time - b.time}).map((segment, index) => {
            mainheading = segment.mainheading[alpha3] ||
                segment.mainheading[`${alpha3}-public`]
            subheading = segment.subheading[alpha3] ||
                segment.subheading[`${alpha3}-public`]
            //
            // if the table of content looks different in languages with different alphabets, have a look to the following and extend the regexp:
            // https://stackoverflow.com/questions/18471159/regular-expression-with-the-cyrillic-alphabet
            //
            // JavaScript (at least the versions most widely used) does not fully support Unicode.
            // That is to say, \w matches only Latin letters, decimal digits, and underscores ([a-zA-Z0-9_])
            //
            if (mainheading && /[\w\u0430-\u044f0-9]+/.test(mainheading) && mainheading !== lastMainheading) {
                mainIndex += 1;
                subIndex = 0;
                lastMainheading = mainheading;
                // TODO: segment should not be part of the headings object - we need it for editing, but there
                // should be a leaner solution
                headings.push({
                    segment: segment,
                    main: true,
                    chapter: mainIndex + '.',
                    heading: mainheading,
                    time: segment.time,
                    tape_nbr: segment.tape_nbr,
                    subheadings: []
                });
                if (headings.length > 1) {
                    if (index < rawHeadings.length) {
                        // set previous heading's next_time attribute to this segment's time
                        if (headings[headings.length - 2].tape_nbr == segment.tape_nbr) {
                            headings[headings.length - 2].next_time = segment.time;
                        }
                    }
                    if (headings[headings.length - 2].subheadings.length > 0) {
                        // set previous subheading's next_time attribute to this segment's time
                        if (!headings[headings.length - 2].subheadings[headings[headings.length - 2].subheadings.length - 1].next_time) {
                            if (headings[headings.length - 2].subheadings[headings[headings.length - 2].subheadings.length - 1].tape_nbr == segment.tape_nbr) {
                                headings[headings.length - 2].subheadings[headings[headings.length - 2].subheadings.length - 1].next_time = segment.time;
                            }
                        }
                    }
                }
            }
            if (subheading && /[\w\u0430-\u044f0-9]+/.test(subheading)) {
                subIndex += 1;
                if (headings[mainIndex - 1]) {
                    headings[mainIndex - 1].subheadings.push({
                        segment: segment,
                        main: false,
                        heading: subheading,
                        chapter: mainIndex + '.' + subIndex + '.',
                        time: segment.time,
                        tape_nbr: segment.tape_nbr,
                    });
                    if (headings[mainIndex - 1].subheadings.length > 1) {
                        if (index < (rawHeadings.length)) {
                            if (headings[mainIndex - 1].subheadings[headings[mainIndex - 1].subheadings.length - 2].tape_nbr == segment.tape_nbr) {
                                headings[mainIndex - 1].subheadings[headings[mainIndex - 1].subheadings.length - 2].next_time = segment.time;
                            }
                        }
                    }
                } else {
                    console.log(`segment ${segment.id} with alpha3 ${alpha3} tries to add a subheading to headings with index ${mainIndex -1}`);
                    console.log(`There are ${headings.length} headings at this point`);
                }
            }
        })
    }
    return headings;
}
