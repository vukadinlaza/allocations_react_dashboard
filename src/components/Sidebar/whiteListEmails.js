const whitelistEmails = [
  {
    email: 'adam@collider.vc',
  },
  {
    email: 'Adamsulliwong@gmail.com',
  },
  {
    email: 'levanon.adi@gmail.com',
  },
  {
    email: 'Aditya.nagarsheth@gmail.com',
  },
  {
    email: 'altcoinco@gmail.com',
  },
  {
    email: 'ajay@apavp.com',
  },
  {
    email: 'akshay@pensiveibis.com',
  },
  {
    email: 'alain@psionpartners.com',
  },
  {
    email: 'ah323@cornell.edu',
  },
  {
    email: 'alecotto2@gmail.com',
  },
  {
    email: 'ataggart28@gmail.com',
  },
  {
    email: 'alex@apavp.com',
  },
  {
    email: 'alex@creativeventures.vc',
  },
  {
    email: 'alexm@skunk.capital',
  },
  {
    email: 'alexmsimon@gmail.com',
  },
  {
    email: 'theylos@gmail.com',
  },
  {
    email: 'pikovsky.alexej@gmail.com',
  },
  {
    email: 'alex@3h.com.hk',
  },
  {
    email: 'alistairgalloway@gmail.com',
  },
  {
    email: 'amanda_mi@icloud.com',
  },
  {
    email: 'amber.illig@gmail.com',
  },
  {
    email: 'ABURMAN@WESTGROVE.COM',
  },
  {
    email: 'amrit@saxecap.com',
  },
  {
    email: 'ana@ana.vc',
  },
  {
    email: 'aphancox@gmail.com',
  },
  {
    email: 'rewkang@gmail.com',
  },
  {
    email: 'ankush@sumaria.biz',
  },
  {
    email: 'annaescher@gmail.com',
  },
  {
    email: 'anubhavsaxena.usa@gmail.com',
  },
  {
    email: 'jolly@ajollylife.com',
  },
  {
    email: 'arilitan@gmail.com',
  },
  {
    email: 'adevabhaktuni@gmail.com',
  },
  {
    email: 'asfandyarnadeem@gmail.com',
  },
  {
    email: 'ashishrvce@gmail.com',
  },
  {
    email: 'ayanna@precursorvc.com',
  },
  {
    email: 'aylonmorley@gmail.com',
  },
  {
    email: 'backus@proof.vc',
  },
  {
    email: 'beatriz.zeno@gmail.com',
  },
  {
    email: 'clark.ben@gmail.com',
  },
  {
    email: 'ben.clarkesf@gmail.com',
  },
  {
    email: 'ben.forman@parafi.capital',
  },
  {
    email: 'william.arzt@gmail.com',
  },
  {
    email: 'brad@genesisblock.com',
  },
  {
    email: 'bsfeldman10@gmail.com',
  },
  {
    email: 'brian@investingblock.com',
  },
  {
    email: 'bfoster379@gmail.com',
  },
  {
    email: 'bf@ftw.vc',
  },
  {
    email: 'brian@iterative.vc',
  },
  {
    email: 'Brianmcnerney@gmail.com',
  },
  {
    email: 'blwang@gmail.com',
  },
  {
    email: 'brit.yonge@gmail.com',
  },
  {
    email: 'bwalk9208@gmail.com',
  },
  {
    email: 'bbarclay@axon-cp.com',
  },
  {
    email: 'bryan@ebtgroupholdings.com',
  },
  {
    email: 'calvin@compound.finance',
  },
  {
    email: 'calvin.ngo@gmail.com',
  },
  {
    email: 'carl.paulo@live.com.au',
  },
  {
    email: 'jgs2243@gmail.com',
  },
  {
    email: 'crazybcoin@gmail.com',
  },
  {
    email: 'c@chrisyork.co',
  },
  {
    email: 'chulyim@gmail.com',
  },
  {
    email: 'clayton.robbins1@gmail.com',
  },
  {
    email: 'craig.burel@gmail.com',
  },
  {
    email: 'dan@goldsilver.com',
  },
  {
    email: 'dan.shafqat@me.com',
  },
  {
    email: 'dane@batshitcrazy.is',
  },
  {
    email: 'weisspick@gmail.com',
  },
  {
    email: 'bitcoin37@gmail.com',
  },
  {
    email: 'david.hall@philipp-fo.com',
  },
  {
    email: 'david@comma.vc',
  },
  {
    email: 'dennis.schuppert@gmail.com',
  },
  {
    email: 'd.lituiev@gmail.com',
  },
  {
    email: 'Don@pioneerfund.vc',
  },
  {
    email: 'konfortydor@gmail.com',
  },
  {
    email: 'dougspace007@gmail.com',
  },
  {
    email: 'dylan@morganbrookcapital.com',
  },
  {
    email: 'edouard@conduitcapitalpartners.com',
  },
  {
    email: 'edwardwest@gmail.com',
  },
  {
    email: 'ezhen@nea.com',
  },
  {
    email: 'thecompanygardener@gmail.com',
  },
  {
    email: 'efranco@gmail.com',
  },
  {
    email: 'fawaz.hourani@gmail.com',
  },
  {
    email: 'gbudhrani@gmail.com',
  },
  {
    email: 'geoffnoyes@gmail.com',
  },
  {
    email: 'glambeth94@gmail.com',
  },
  {
    email: 'g.depastas@gmail.com',
  },
  {
    email: 'giacomo.mariotti@outlook.com',
  },
  {
    email: 'startale.bomber@gmail.com',
  },
  {
    email: 'harvey.multani@gmail.com',
  },
  {
    email: 'heatks@gmail.com',
  },
  {
    email: 'henry.barclay@barclayetal.com',
  },
  {
    email: 'hershel@mehtaventures.co',
  },
  {
    email: 'hongnjiang@outlook.com',
  },
  {
    email: 'idris@sersoub.com',
  },
  {
    email: 'imess2@morgan.edu',
  },
  {
    email: 'ish@goldenarccap.com',
  },
  {
    email: 'thejackluo@gmail.com',
  },
  {
    email: 'jackleonprior@gmail.com',
  },
  {
    email: 'jmoses.hq@gmail.com',
  },
  {
    email: 'jai@208seedventures.com',
  },
  {
    email: 'jai@208seedventures.com',
  },
  {
    email: 'jjebloemena@gmail.com',
  },
  {
    email: 'inbox.chi@gmail.com',
  },
  {
    email: 'james@spacefund.com',
  },
  {
    email: 'james.shawsworld@gmail.com',
  },
  {
    email: 'jamie@cryptx.capital',
  },
  {
    email: 'jan.stijohann@outlook.com',
  },
  {
    email: 'jborseth@gmail.com',
  },
  {
    email: 'j.byun94@gmail.com',
  },
  {
    email: 'jeff@seraphimcapital.com',
  },
  {
    email: 'jefflieberman@gmail.com',
  },
  {
    email: 'jeffrey.lin@oakskycapital.com',
  },
  {
    email: 'jeff@gpofund.com',
  },
  {
    email: 'jengyang.chia@gmail.com',
  },
  {
    email: 'jennyrator@gmail.com',
  },
  {
    email: 'jerryc@skunk.capital',
  },
  {
    email: 'jessica@somacap.com',
  },
  {
    email: 'Joe@redrock.capital',
  },
  {
    email: 'jojozhao726@gmail.com',
  },
  {
    email: 'joel.karacozoff@gmail.com',
  },
  {
    email: 'joey@firstservepartners.com',
  },
  {
    email: 'jonmcfaul@gmail.com',
  },
  {
    email: 'johnsforms@gmail.com',
  },
  {
    email: 'jgemmeke@gmail.com',
  },
  {
    email: 'josephlizyness@gmail.com',
  },
  {
    email: 'joshk@recvf.com',
  },
  {
    email: 'josh@metzger.ventures',
  },
  {
    email: 'joshua@wiasecapital.com',
  },
  {
    email: 'joshua@donotpay.com',
  },
  {
    email: 'jchiavas@yahoo.fr',
  },
  {
    email: 'kyokley@rrdschicago.com',
  },
  {
    email: 'kendrakinnison@gmail.com',
  },
  {
    email: 'kennethchao66@gmail.com',
  },
  {
    email: 'kevin@consilienceventures.com',
  },
  {
    email: 'key@gpofund.com',
  },
  {
    email: 'kadvani1@gmail.com',
  },
  {
    email: 'komal.sethi@gmail.com',
  },
  {
    email: 'allocationscapital@krisprice.nz',
  },
  {
    email: 'Kylearmour@gmail.com',
  },
  {
    email: 'kyletwang@gmail.com',
  },
  {
    email: 'lwarsavsky@gmail.com',
  },
  {
    email: 'leocheng@gmail.com',
  },
  {
    email: 'lev@dubinets.io',
  },
  {
    email: 'luis@brecci.legal',
  },
  {
    email: 'Lukasjohanneskoch@gmail.com',
  },
  {
    email: 'mac@rarebreed.vc',
  },
  {
    email: 'upyougonow@gmail.com',
  },
  {
    email: 'phaedrus.one@gmail.com',
  },
  {
    email: 'Mcattini@pm.me',
  },
  {
    email: 'mark@centuryinvestmentgroup.com',
  },
  {
    email: 'mark@apenu.com',
  },
  {
    email: 'martinjash@gmail.com',
  },
  {
    email: 'matthew@marbletech.co',
  },
  {
    email: 'max@dover.io',
  },
  {
    email: 'meagan@spacefund.com',
  },
  {
    email: 'yoblaze@hotmail.com',
  },
  {
    email: 'micahjw@gmail.com',
  },
  {
    email: 'michael@lchgv.com',
  },
  {
    email: 'mrmojica@yahoo.com',
  },
  {
    email: 'micheleguo@gmail.com',
  },
  {
    email: 'miguelnnferreira@gmail.com',
  },
  {
    email: 'mj@nucleushg.com',
  },
  {
    email: 'mj@nucleushg.com',
  },
  {
    email: 'mj@nucleushg.com',
  },
  {
    email: 'morgan@manaventures.vc',
  },
  {
    email: 'NANCY@NKHGROUP.COM',
  },
  {
    email: 'nathan@airstreet.com',
  },
  {
    email: 'neel@acesotp.com',
  },
  {
    email: 'neil@necessary.vc',
  },
  {
    email: 'nfrichler@gmail.com',
  },
  {
    email: 'nick@lumenadvisory.com',
  },
  {
    email: 'nick@halfdomeventures.com',
  },
  {
    email: 'nbiv97@gmail.com',
  },
  {
    email: 'Noufalhaqbani@gmail.com',
  },
  {
    email: 'peter@elysium.vc',
  },
  {
    email: 'philippxbeer@gmail.com',
  },
  {
    email: 'philattia@gmail.com',
  },
  {
    email: 'phillip@pimlicopartners.com',
  },
  {
    email: 'rajiv@highhamptoncapital.com',
  },
  {
    email: 'mez@morethanhuman.org',
  },
  {
    email: 'raphael@e2mc.space',
  },
  {
    email: 'regina.chi@gmail.com',
  },
  {
    email: 'Rick@SpaceFund.com',
  },
  {
    email: 'rtheryoung@gmail.com',
  },
  {
    email: 'rklauer@boldrosecapital.com',
  },
  {
    email: 'rogerspitz@gmail.com',
  },
  {
    email: 'rohit.gupta@gmail.com',
  },
  {
    email: 'sajid@myasiavc.com',
  },
  {
    email: 'sam.copley@truventuro.com',
  },
  {
    email: 'swfrank@gmail.com',
  },
  {
    email: 'Sanjay@mehtaventures.co',
  },
  {
    email: 'sanjeev.bhalla.usa@gmail.com',
  },
  {
    email: 'santinocucchiara@hotmail.com',
  },
  {
    email: 'sean@venturecoin.io',
  },
  {
    email: 'sebastian.zhou@alphasquaregroup.com',
  },
  {
    email: 'sergio@methuselahfund.com',
  },
  {
    email: 'howleysv@gmail.com',
  },
  {
    email: 'Sharon.niv@gmail.com',
  },
  {
    email: 'sherman@rocco.ai',
  },
  {
    email: 'sonia.weiss.pick@gmail.com',
  },
  {
    email: 'Spencer@transform.capital',
  },
  {
    email: 'sree@lando.com',
  },
  {
    email: 'spomichter@romuluscap.com',
  },
  {
    email: 'steven@starbridgevc.com',
  },
  {
    email: 'sduyar@rengen.io',
  },
  {
    email: 'sultan@envst.com',
  },
  {
    email: 'choi.sung.h@gmail.com',
  },
  {
    email: 'sunilsrivatsa@gmail.com',
  },
  {
    email: 'sunny@signiavc.com',
  },
  {
    email: 'tejpaulb@google.com',
  },
  {
    email: 'themasap@civilizationventures.com',
  },
  {
    email: 'thomas@newmissioncity.com',
  },
  {
    email: 'tistrazz@gmail.com',
  },
  {
    email: 'reachtommytran@gmail.com',
  },
  {
    email: 't@nyvp.com',
  },
  {
    email: 'vera.futorjanski@gmail.com',
  },
  {
    email: 'vikramsmashru@gmail.com',
  },
  {
    email: 'vlad.vdov@gmail.com',
  },
  {
    email: 'willbholtz@gmail.com',
  },
  {
    email: 'wm@portfolio.ventures',
  },
  {
    email: 'xavier.labatie@gmail.com',
  },
  {
    email: 'ujfmd3048@gmail.com',
  },
  {
    email: 'abramovaya3@gmail.com',
  },
  {
    email: 'yidapb@gmail.com',
  },
  {
    email: 'soloveya@hotmail.com',
  },
  {
    email: 'hargreaves.z@gmail.com',
  },
  {
    email: 'zachary.rapp2@gmail.com',
  },
  {
    email: 'joel@allocations.com',
  },
  {
    email: 'lance@allocations.com',
  },
  {
    email: 'nils@allocations.com',
  },
  {
    email: 'olia@allocations.com',
  },
  {
    email: 'jessica@allocations.com',
  },
  {
    email: 'kingsley@allocations.com',
  },
  {
    email: 'michelle@allocations.com',
  },
  {
    email: 'brandon@allocations.com',
  },
  {
    email: 'tim@allocations.com',
  },
  {
    email: 'luis@allocations.com',
  },
  {
    email: 'robert@allocations.com',
  },
];

export default whitelistEmails;
