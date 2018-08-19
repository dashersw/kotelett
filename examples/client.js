const kote = require('../');

const sleep = require('await-sleep')

async function main() {
    console.log('sending A');
    console.log(await kote.send('A'));

    await sleep(2000);

    console.log('sending B');

    console.log(await kote.send('B'));
    await sleep(2000);
    
    console.log('sending C');
    console.log(await kote.send('C'));
    await sleep(2000);
    console.log('sending A');
    console.log(await kote.send('A'));
    await sleep(2000);
    
    console.log('sending B');
    console.log(await kote.send('B'));
    
    await sleep(2000);
    
    console.log('sending B');
    console.log(await kote.send('B'));
    
    await sleep(2000);
    console.log('sending A');
    console.log(await kote.send('A'));
    await sleep(2000);
    console.log('sending A');
    console.log(await kote.send('A'));
    await sleep(2000);
    console.log('sending C');
    console.log(await kote.send('C'));
    await sleep(2000);
    console.log('sending C');
    kote.send('C').then(console.log)
    await sleep(2000);

    console.log('sending B');
    console.log(await kote.send('B'));

    await sleep(2000);

    console.log('sending B');
    console.log(await kote.send('B'));
    await sleep(2000);

    console.log('sending B');
    console.log(await kote.send('B'));

    await sleep(2000);

    console.log('sending B');
    console.log(await kote.send('B'))
    await sleep(2000);

    console.log('sending D');
    console.log(await kote.send('D'))
    await sleep(2000);

    console.log('sending D');
    console.log(await kote.send('D'))

    process.exit()

    // setInterval(async () => {
    //     console.log('sending D');

    //     console.log(await kote.send('D'}))
    // }, 1000)
}

main()
