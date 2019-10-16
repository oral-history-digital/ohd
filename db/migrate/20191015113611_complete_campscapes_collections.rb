class CompleteCampscapesCollections < ActiveRecord::Migration[5.2]
  def change
    if Project.current.identifier.to_sym == :campscapes
      array = [
        {
          "Collection_ID": 4,
          "Collection_Shorttitle": "Jasenovac Memorial",
          "Collection_Longtitle": "Jasenovac Memorial Museum, Interviews Collection",
          "Collection_Description": "The Jasenovac Memorial Museum conducts and preserves recordings of interviews with survivors of the Jasenovac concentration camp. The collection hosts audio and video recordings of over 90 oral history interviews.",
          "Collection_Link": "http://www.jusp-jasenovac.hr/Default.aspx?sid=6711",
        },
        {
          "Collection_ID": 6,
          "Collection_Shorttitle": "USC Shoah Foundation VHA",
          "Collection_Longtitle": "USC Shoah Foundation, the Institute for Visual History and Education - Visual History Archive®",
          "Collection_Description": "The Visual History Archive of the Institute for Visual History and Education is a non-profit organization conducting, preserving and making accessible, for education and research, interviews with witnesses and survivors of the Holocaust and other genocides. It hosts over 54,000 eyewitness testimonies. The Visual History Archive is the largest digital collection of its kind in the world. Every testimony is digitized and fully searchable with up-to-date indexing.",
          "Collection_Link": "https://sfi.usc.edu",
        },
        {
          "Collection_ID": 11,
          "Collection_Shorttitle": "Serbian Holocaust",
          "Collection_Longtitle": "Serbian Holocaust",
          "Collection_Description": "Serbian Holocaust is an oral history project initiated by Halpern Bojanovich, a citizen of the United States. Between 2010 and 2013, almost 200 Interviews were conducted with individuals giving accounts of their experiences of the Second World War in Serbia, among them survivors of concentration camps, former partisans and relatives of victims.",
          "Collection_Link": "http://www.serbianholocaust.org",
        },
        {
          "Collection_ID": 12,
          "Collection_Shorttitle": "Fortunoff Archive",
          "Collection_Longtitle": "Fortunoff Video Archive for Holocaust Testimonies, Yale University (Fortunoff Archive)",
          "Collection_Description": "The Fortunoff Archive for Holocaust Testimonies, established in 1979, is located at Yale University. The Archive records testimonies of Holocaust Survivors to preserve their memories and make them to researchers and the public. The archive is considered as a forerunner of videotaped Oral History and contains around 4400 interviews.",
          "Collection_Link": "https://fortunoff.library.yale.edu",
        },
        {
          "Collection_ID": 13,
          "Collection_Shorttitle": "Zwangsarbeit 1939-1945",
          "Collection_Longtitle": "Interview Archive Forced Labor 1939-1945",
          "Collection_Description": "The interview archive Forced Labor 1939-1945 (Zwangsarbeit 1939-1945) is hosted at the Center for Digital Systems of the Free University of Berlin. It contains nearly 600 video interviews with people forced by the Nazis to perform forced labor on behalf of Nazi Germany.  The interview archive Forced Labor The archive is accessible online upon registration and is available in German, English and Russian.",
          "Collection_Link": "https://www.zwangsarbeit-archiv.de/en/index.html",
        },
        {
          "Collection_ID": 14,
          "Collection_Shorttitle": "USHMM",
          "Collection_Longtitle": "The United States Holocaust Memorial Museum (USHMM), Jeff and Toby Herr Oral History Archive",
          "Collection_Description": "The Oral History Archive of the United States Holocaust Memorial Museum hosts one of the largest collections of recorded interviews pertaining to the Holocaust. It contains over 77,000 interviews with survivors, Sinti and Roma, Jehovah’s Witnesses, people persecuted because of their sexual orientation, political prisoners and other victims of Nazism, as well as liberators, collaborators and rescuers. Apart from interviews conducted by USHMM, the Oral History Archive includes recordings from other oral history collections. The archive catalog is available online. The majority of the recordings can be viewed online, some have restricted availability and can only viewed on-site.",
          "Collection_Link": "https://www.ushmm.org/collections/the-museums-collections/about/oral-history",
        },
        {
          "Collection_ID": 15,
          "Collection_Shorttitle": "Croatian Memories",
          "Collection_Longtitle": "Croatian Memories: Unveiling Personal Memories on War and Detention (CroMe)",
          "Collection_Description": "The project Croatian Memories: Unveiling Personal Memories on War and Detention (CroMe) is a collection of over 400 video interviews pertaining to crucial political events in Croatia. Many interviews relate directly or indirectly to the Second World War and the Holocaust. The project was launched in 2010 and aims to make the recordings available online for a broader audience.",
          "Collection_Link": "http://www.croatianmemories.org/en/",
        },
        {
          "Collection_ID": 16,
          "Collection_Shorttitle": "Memory of Nations",
          "Collection_Longtitle": "Memory of Nations",
          "Collection_Description": "Memory of Nations (Paměť národa) is an online collection of over 9500 audio and video interviews. It is an ongoing collaborative project of the Czech Institute for the Study of Totalitarian Regimes, the Czech radio broadcaster Český rozhlas, and the association Post Bellum. In place sice 2008, it conducts, preserves and makes accessible oral history interviews pertaining to both World Wars, Nazi occupation, and state socialism.",
          "Collection_Link": "https://www.memoryofnations.eu/en",
        },
        {
          "Collection_ID": 17,
          "Collection_Shorttitle": "Legacy/Zavestanje",
          "Collection_Longtitle": "Legacy/Zavestanje",
          "Collection_Description": "Legacy is an oral history project carried out between 2012 and 2015. Within the framework of the project, 94 people were interviewed and 450 hours of film material taped. Most of the interviewees are survivors of Ustaša children’s concentration camps at Jastrebarsko and Sisak. A documentary based on the film material was released in 2016 under the same title.",
          "Collection_Link": "http://www.legacy-documentary.com/en/",
        },
        {
          "Collection_ID": 18,
          "Collection_Shorttitle": "Westerbork Memorial",
          "Collection_Longtitle": "Memorial Centre – Kamp Westerbork",
          "Collection_Description": "The Memorial Centre – Kamp Westerbork conducted several hundred oral history interviews pertaining to the functioning of the camp across various periods as a refugee camp for Jewish escapees from Nazi Germany, as a Nazi transit camp, as an internment camp for alleged collaborators, and a settlement for Moluccans who fought in the Royal Dutch Indian Army in the Dutch East Indies.",
          "Collection_Link": "https://kampwesterbork.nl/en/",
        },
        {
          "Collection_ID": 19,
          "Collection_Shorttitle": "Die Frauen von Ravensbrück",
          "Collection_Longtitle": "Women of Ravensbrück, Video Archive  Die Frauen von Ravensbrück. Das Videoarchiv",
          "Collection_Description": "Women of Ravensbrück, Video Archive (Die Frauen von Ravensbrück. Das Videoarchiv) is a collection of over 200 biographical interviews with survivors of the camps of Ravensbrück, Moringen and Lichtenburg. The interviews were conducted between 1980 and 2008 by filmmaker Loretta Walz in cooperation with Ravensbrück Memorial and the FernUniversität Hagen. The video archive gives important insights into the history of women and society in the 20th century.",
          "Collection_Link": "https://www.videoarchiv-ravensbrueck.de/",
        },
        {
          "Collection_ID": 20,
          "Collection_Shorttitle": "Imperial War Museum",
          "Collection_Longtitle": "Imperial War Museum, London",
          "Collection_Description": "The collection of the Imperial War Museum London includes around 800,000 items collected by the museum since 1917, which pertain to modern conflicts and warfare. This includes an oral history collection of a large number of audio-recorded personal accounts linked to the experiencing and surviving of World War II and the Holocaust.",
          "Collection_Link": "https://www.iwm.org.uk",
        },
        {
          "Collection_ID": 21,
          "Collection_Shorttitle": "Holocaust Memorial Center",
          "Collection_Longtitle": "Holocaust Memorial Center Library Archive, Farmington Hills (USA) - Oral History Department",
          "Collection_Description": "Since the early 1980s, the Oral History Department at the Holocaust Memorial Center Library Archive in Farmington Hills has recorded testimonies of Holocaust survivors, liberators, rescuers, and other witnesses of the Second World War. To this day, the HMC conducts, preserves and makes accessible over 700 audio and video interviews.",
          "Collection_Link": "https://www.holocaustcenter.org/visit/library-archive/oral-history-department/",
        },
        {
          "Collection_ID": 22,
          "Collection_Shorttitle": "Refugee Voices",
          "Collection_Longtitle": "Refugee Voices - Oral History collection of the Association of Jewish Refugees (AJR)",
          "Collection_Description": "The collection Refugee Voices of the Association of Jewish Refugees (AJR) contains 150 biographic interviews with Jewish survivors of National Socialism who fled to Great Britain during World War II or emigrated there after 1945. The life stories focus on the experience of migration and exile. To enhance usability for educational and research purposes, all of the interviews are transcribed and supplemented with biographic information, video stills and relevant documents.",
          "Collection_Link": "https://www.ajrrefugeevoices.org.uk",
        },
        {
          "Collection_ID": 23,
          "Collection_Shorttitle": "British Library Sound Archive",
          "Collection_Longtitle": "British Library Sounds, Oral History",
          "Collection_Description": "The Oral History collection of British Library Sounds includes over 1800 accounts of the survivors of the Holocaust, who settled in Britain after the Second World War.",
          "Collection_Link": "https://sounds.bl.uk/Oral-history",
        },
        {
          "Collection_ID": 24,
          "Collection_Shorttitle": "Jewish Holocaust Centre",
          "Collection_Longtitle": "Jewish Holocaust Centre, Melbourne, Philip Maisel Testimonies Project",
          "Collection_Description": "The Jewish Holocaust Centre in Melbourne hosts the Philip Maisel Testimonies Project. The collection contains over 1300 video testimonies as well as over 200 audio testimonies. The interviews focus on experiences of Nazi persecution and the Holocaust.",
          "Collection_Link": "https://www.jhc.org.au",
        },
        {
          "Collection_ID": 25,
          "Collection_Shorttitle": "Voice/Vision",
          "Collection_Longtitle": "Voice/Vision Holocaust Survivor Oral History Archive",
          "Collection_Description": "The Voice/Vision Holocaust Survivor Oral History Archive is located at the Mardigian Library of the University of Michigan. It provides oral history interviews with Holocaust survivors, conducted by Professor Sidney Bolkosky since 1981. To support further research and educational work in the field of Holocaust studies, the collection is accessible online.",
          "Collection_Link": "https://holocaust.umd.umich.edu",
        },
        {
          "Collection_ID": 26,
          "Collection_Shorttitle": "American Jewish Archives",
          "Collection_Longtitle": "The Jacob Rader Marcus Center of American Jewish Archives, Cincinnati (American Jewish Archives)",
          "Collection_Description": "The Jacob Rader Marcus Center of American Jewish Archives, located at the Hebrew Union College - Jewish Institute of Religion in Cincinnati, was established in 1947. It houses numerous documents on the history of Jews and Jewish life, including audio and video tapes of interviews with Holocaust survivors.",
          "Collection_Link": "http://americanjewisharchives.org",
        },
        {
          "Collection_ID": 27,
          "Collection_Shorttitle": "Falstad Centre",
          "Collection_Longtitle": "Falstad Memorial and Human Rights Centre",
          "Collection_Description": "The Falstad Memorial and Human Rights Center has an oral history collection containing over 160 audio and video interviews with survivors of the wartime SS Falstad Prison Camp, and the postwar internment camp for alleged Nazi collaborators. The collection also includes interviews with members of the local population.",
          "Collection_Link": "https://falstadsenteret.no/en/",
        },
        {
          "Collection_ID": 28,
          "Collection_Shorttitle": "Voices of the Holocaust",
          "Collection_Longtitle": "Voices of the Holocaust, David Boder Collection",
          "Collection_Description": "The Voices of the Holocaust is a collection of audio interviews with Holocaust survivors conducted in 1946 by psychologist David P. Boder. Boder recorded 118 interviews in various Displaced Persons camps (DP camps) in France, Germany, Italy and Switzerland. These audio recordings constitute the first oral history archive of the Holocaust. They are transcribed and available online.",
          "Collection_Link": "http://voices.iit.edu",
        },
        {
          "Collection_ID": 29,
          "Collection_Shorttitle": "Sprechen trotz allem",
          "Collection_Longtitle": "Sprechen trotz allem. Lebensgeschichtliche Interviews der Stiftung Denkmal für die ermordeten Juden Europas",
          "Collection_Description": "The video archive Sprechen trotz allem (Speaking nonetheless) contains biographical interviews with Holocaust survivors. It is hosted by the Berlin-based Foundation Memorial to the Murdered Jews in Europe (Stiftung Denkmal für die ermordeten Juden Europas). The interviews have been conducted since 2009. The collection contains over 70 interviews.",
          "Collection_Link": "https://www.sprechentrotzallem.de",
        },
        {
          "Collection_ID": 30,
          "Collection_Shorttitle": "Bergen-Belsen Memorial",
          "Collection_Longtitle": "Bergen-Belsen Memorial, Video and Audio Collection",
          "Collection_Description": "The Bergen-Belsen Memorial video and audio collection contains over 6000 interviews. They have been conducted since the late 1990s with survivors of the concentration camp, the Prisoners of War (POW) camp, with inhabitants of the DP camp and with other eye-witnesses. Excerpts of many of the interviews are included in the permanent exhibition in the museum building.",
          "Collection_Link": "https://bergen-belsen.stiftung-ng.de/en/research-and-documentation/collection/",
        },
        {
          "Collection_ID": 31,
          "Collection_Shorttitle": "Lager e Deportazione",
          "Collection_Longtitle": "Lager e Deportazione",
          "Collection_Description": "The project Lager e Deportazione is hosted at the Public City Library of the municipality of Nova Milanese (Biblioteca Civica Popolare del Comune di Nova Milanese). It contains interviews with Italian survivors of various Nazi concentration camps.",
          "Collection_Link": "http://www.lageredeportazione.org",
        },
        {
          "Collection_ID": 32,
          "Collection_Shorttitle": "Terezín Memorial",
          "Collection_Longtitle": "Terezín Memorial, Department of Documentation",
          "Collection_Description": "The Department of Documentation of the Terezín Memorial collects sources pertaining to the history of Nazi occupation of the present-day Czech Republic. It hosts archival documents, material objects and written accounts of the survivors of the camps at Terezín and Litoměřice. It also contains recorded testimonies of survivors of the Holocaust. Specific searches to inventory can be conducted by accessing an online database.",
          "Collection_Link": "https://www.pamatnik-terezin.cz/collections#toc_1",
        },
        {
          "Collection_ID": 33,
          "Collection_Shorttitle": "Fondation de la Mémoire Contemporaine",
          "Collection_Longtitle": "Fondation de la Mémoire Contemporaine, Bruxelles",
          "Collection_Description": "The Belgian Fondation de la Mémoire Contemporaine was established in 1994 as an Academic Institute of Research. It collects interviews of Jews in Belgium recounting various experiences before, during and after World War II and the Holocaust.",
          "Collection_Link": "http://www.fmc-seh.be/en/",
        },
        {
          "Collection_ID": 34,
          "Collection_Shorttitle": "Holocaust Education Centre",
          "Collection_Longtitle": "Sarah and Chaim Neuberger Holocaust Education Centre",
          "Collection_Description": "The Sarah and Chaim Neuberger Holocaust Education Centre opened in 1985 as the Holocaust Centre of Toronto. It hosts a collection of over 400 digital interviews with Holocaust survivors conducted by the Centre. The Centre library also contains books, films and other documentary materials.",
          "Collection_Link": "https://www.holocaustcentre.com/library",
        },
        {
          "Collection_ID": 35,
          "Collection_Shorttitle": "Wisconsin Archive",
          "Collection_Longtitle": "State Historical Society of Wisconsin, Archive Division",
          "Collection_Description": "The Archive Division of the State Historical Society of Wisconsin hosts 22 interviews with Holocaust survivors who settled in Wisconsin after 1945. These testimonies and two further interviews with U.S. witnesses were conducted by Wisconsin Historical Society archivists between 1974 and 1981. The interviews are available online.",
          "Collection_Link": "http://sites.rootsweb.com/~ilwinneb/wihissoc.htm",
        },
      ]

      array.each do |collection|
        id = collection[:Collection_ID]
        homepage = collection[:Collection_Link]
        notes = collection[:Collection_Description]
        institution = collection[:Collection_Longtitle]
        Collection.find_by_id(id).try(:update, {
          homepage: homepage,
          notes: notes,
          institution: institution,
        })
      end
    end
  end
end
