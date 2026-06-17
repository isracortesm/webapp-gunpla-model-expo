import { GetEventUseCase } from './domain/usecases/event-dashboard/get-event-usecase';
import { EventDashboardRepositoryImpl } from './data/repositories/event-dashboard/event-dashboard-repository-impl';
import { HttpService } from './data/services/http-client';

async function main() {
  console.log('=== Testing GetEventUseCase ===\n');

  // Setup dependencies with test API URL
  // Base URL is the host without /api - the repository adds /api/events as endpoint
  const httpService = new HttpService(
    'https://hobby-city-api-test--hobbycity-26940.us-central1.hosted.app'
  );
  const repository = new EventDashboardRepositoryImpl(httpService);
  const useCase = new GetEventUseCase(repository);

  // Test Case 1: Valid event code
  console.log('Test 1: Fetching valid event (HMKGME26)...');
  try {
    const event = await useCase.execute('HMKGME26');
    
    console.log(`✅ Event fetched successfully`);
    console.log(`   ID: ${event.id}`);
    console.log(`   Event Code: ${event.eventId}`);
    console.log(`   Name: ${event.name}`);
    console.log(`   Short Description: ${event.shortDescription.substring(0, 60)}...`);
    console.log(`   Cost Type: ${event.costType}`);
    console.log(`   Start Date: ${event.startDate}`);
    console.log(`   End Date: ${event.endDate}`);

    // Validate image
    if (event.image) {
      console.log(`\n✅ Image attached:`);
      console.log(`   URL: ${event.image.url.substring(0, 60)}...`);
      if (event.image.thumbnailUrl) {
        console.log(`   Thumbnail: ${event.image.thumbnailUrl.substring(0, 60)}...`);
      }
    } else {
      console.log('\n⚗ No image attached');
    }

    // Validate category
    if (event.category) {
      console.log(`\n✅ Category attached:`);
      console.log(`   Name: ${event.category.name}`);
      console.log(`   Description: ${event.category.description.substring(0, 60)}...`);
    } else {
      console.log('\n⚗ No category attached');
    }

    // Validate description length
    if (event.description.length > 100) {
      console.log(`\n✅ Description is substantial (${event.description.length} characters)`);
    }

  } catch (error: any) {
    console.error(`❌ Test 1 FAILED: ${error.message}`);
    process.exit(1);
  }

  // Test Case 2: Invalid event code
  console.log('\nTest 2: Fetching invalid event code...');
  try {
    await useCase.execute('INVALID_CODE');
    console.error('❌ Test 2 FAILED: Should have thrown an error for invalid event code');
    process.exit(1);
  } catch (error: any) {
    if (error.message.includes('not found')) {
      console.log(`✅ Correctly threw error for invalid event: ${error.message}`);
    } else {
      console.error(`❌ Test 2 FAILED: Wrong error message: ${error.message}`);
      process.exit(1);
    }
  }

  // Test Case 3: Empty string event code
  console.log('\nTest 3: Fetching empty event code...');
  try {
    await useCase.execute('');
    console.error('❌ Test 3 FAILED: Should have thrown an error for empty event code');
    process.exit(1);
  } catch (error: any) {
    if (error.message.includes('not found')) {
      console.log(`✅ Correctly threw error for empty event code`);
    } else {
      console.error(`❌ Test 3 FAILED: Wrong error message: ${error.message}`);
      process.exit(1);
    }
  }

  // Test Case 4: Non-existent event code
  console.log('\nTest 4: Fetching non-existent event code (NONEXISTENT)...');
  try {
    await useCase.execute('NONEXISTENT');
    console.error('❌ Test 4 FAILED: Should have thrown an error for non-existent event');
    process.exit(1);
  } catch (error: any) {
    if (error.message.includes('not found')) {
      console.log(`✅ Correctly threw error for non-existent event`);
    } else {
      console.error(`❌ Test 4 FAILED: Wrong error message: ${error.message}`);
      process.exit(1);
    }
  }

  console.log('\n=== All tests passed! ===');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
